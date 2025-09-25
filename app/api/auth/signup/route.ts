import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword, generateToken } from '@/lib/auth';

const prisma = new PrismaClient();

// POST /api/auth/signup
export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, country, legalName } = await request.json();

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !country || !legalName) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user and artist in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: 'ARTIST'
        }
      });

      // Create artist profile
      const artist = await tx.artist.create({
        data: {
          name: `${firstName} ${lastName}`,
          legalName,
          country,
          email,
          kycStatus: 'PENDING'
        }
      });

      return { user, artist };
    });

    // Generate JWT token
    const token = generateToken({
      id: result.user.id,
      email: result.user.email,
      username: result.user.username,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      bio: result.user.bio,
      website: result.user.website,
      location: result.user.location,
      avatar: result.user.avatar,
      isEmailVerified: result.user.isEmailVerified,
      role: result.user.role
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role
        },
        artist: {
          id: result.artist.id,
          name: result.artist.name,
          kycStatus: result.artist.kycStatus
        },
        token
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/auth/login
export async function PUT(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        // Include artist profile if exists
      }
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Account is deactivated' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Get artist profile
    const artist = await prisma.artist.findUnique({
      where: { email: user.email }
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        artist: artist ? {
          id: artist.id,
          name: artist.name,
          kycStatus: artist.kycStatus
        } : null,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
