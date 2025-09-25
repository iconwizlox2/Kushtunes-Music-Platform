import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { success: false, message: 'Username is required' },
        { status: 400 }
      );
    }

    // Validate username format
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json({
        success: true,
        available: false,
        message: 'Username must be 3-20 characters long'
      });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({
        success: true,
        available: false,
        message: 'Username can only contain letters, numbers, and underscores'
      });
    }

    // Check if username exists
    const existingUser = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: { id: true }
    });

    return NextResponse.json({
      success: true,
      available: !existingUser,
      message: existingUser ? 'Username is already taken' : 'Username is available'
    });

  } catch (error) {
    console.error('Username check error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check username availability' },
      { status: 500 }
    );
  }
}
