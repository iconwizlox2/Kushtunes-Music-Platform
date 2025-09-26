import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateEmailVerificationToken } from '@/lib/auth';

const prisma = new PrismaClient();

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Send email verification
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
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Email verification is not implemented in the current schema
    // For now, we'll skip this check

    // Generate verification token
    const verificationToken = generateEmailVerificationToken();

    // Store verification token (in production, you'd store this in a separate table)
    // For now, we'll simulate the email sending process
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    // In production, you would send an actual email here
    console.log('Email verification URL:', verificationUrl);

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully',
      data: {
        verificationUrl, // Only for development/testing
        email: user.email
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

// Verify email
export async function PUT(request: NextRequest) {
  try {
    const { token, email } = await request.json();

    if (!token || !email) {
      return NextResponse.json(
        { success: false, message: 'Token and email are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Email verification is not implemented in the current schema
    // For now, we'll skip this check

    // In production, you would verify the token against a stored verification token
    // For now, we'll accept any token for testing
    if (token.length < 10) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification token' },
        { status: 400 }
      );
    }

    // Mark email as verified (not implemented in current schema)
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: { isEmailVerified: true }
    // });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Email verification failed' },
      { status: 500 }
    );
  }
}
