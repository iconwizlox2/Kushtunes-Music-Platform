import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import { generateEmailVerificationToken } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, country, artistType, legalName, phone } = await req.json();

    if (!email || !password || !name || !legalName) {
      return NextResponse.json({ error: "Name, email, password, and legal name are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 12);
    
    // Create user and artist in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ 
        data: { 
          email, 
          name: name, 
          passwordHash: hash 
        } 
      });
      
      const artist = await tx.artist.create({ 
        data: { 
          userId: user.id, 
          name: name, 
          legalName: legalName,
          email,
          country: country || "GB",
          role: artistType === 'label' ? 'admin' : 'user'
        } 
      });

      // If it's a label, create a label record
      if (artistType === 'label') {
        await tx.label.create({
          data: {
            name: name,
            ownerId: artist.id
          }
        });
      }

      return { user, artist };
    });

    // Generate and send verification email
    const token = generateEmailVerificationToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store verification token
    await prisma.emailVerificationToken.create({
      data: {
        userId: result.user.id,
        token,
        expires
      }
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
    
    try {
      await sendVerificationEmail({
        to: result.user.email,
        name: result.user.name || result.user.email.split('@')[0],
        verificationUrl
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email sending fails
    }

    return NextResponse.json({ 
      success: true, 
      message: "Account created successfully. Please check your email to verify your account.",
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          emailVerified: false
        },
        artist: {
          id: result.artist.id,
          name: result.artist.name,
          role: result.artist.role
        },
        // In development, include the verification URL for testing
        ...(process.env.NODE_ENV === 'development' && { verificationUrl })
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
