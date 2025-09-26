import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find verification token
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      // Clean up expired token
      await prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id }
      });

      return NextResponse.json(
        { success: false, message: 'Verification token has expired' },
        { status: 400 }
      );
    }

    // Check if user is already verified
    if (verificationToken.user.emailVerified) {
      return NextResponse.json(
        { success: false, message: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Mark email as verified and clean up token
    await prisma.$transaction([
      prisma.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: new Date() }
      }),
      prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id }
      })
    ]);

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: {
          id: verificationToken.user.id,
          email: verificationToken.user.email,
          name: verificationToken.user.name,
          emailVerified: true
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
