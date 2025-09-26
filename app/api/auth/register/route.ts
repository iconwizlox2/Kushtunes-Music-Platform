import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";

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

    return NextResponse.json({ 
      success: true, 
      message: "Account created successfully",
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name
      },
      artist: {
        id: result.artist.id,
        name: result.artist.name,
        role: result.artist.role
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
