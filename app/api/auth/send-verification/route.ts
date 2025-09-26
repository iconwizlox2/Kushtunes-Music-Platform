import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateEmailVerificationToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, emailVerified: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, message: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate verification token
    const token = generateEmailVerificationToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store token in database
    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token,
        expires
      }
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
    
    try {
      await sendVerificationEmail({
        to: user.email,
        name: user.name || user.email.split('@')[0],
        verificationUrl
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the request if email sending fails
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully',
      data: {
        email: user.email,
        // In development, include the verification URL for testing
        ...(process.env.NODE_ENV === 'development' && { verificationUrl })
      }
    });

  } catch (error) {
    console.error('Send verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
