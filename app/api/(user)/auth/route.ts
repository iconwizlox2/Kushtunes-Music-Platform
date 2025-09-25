import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { 
  hashPassword, 
  verifyPassword, 
  generateToken, 
  generateSessionToken,
  isValidEmail, 
  isValidPassword, 
  isValidUsername,
  createAuthResponse,
  extractTokenFromHeader,
  verifyToken
} from '@/lib/auth';

const prisma = new PrismaClient();

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
function checkRateLimit(ip: string, limit: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const key = `rate_limit_${ip}`;
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count++;
  rateLimitStore.set(key, current);
  return true;
}

// Enhanced security validation
function validateRegistrationData(data: any) {
  const errors: string[] = [];

  // Email validation
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else {
    if (data.email.length > 254) {
      errors.push('Email is too long');
    }
    if (!isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }
  }

  // Password validation
  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required');
  } else {
    const passwordValidation = isValidPassword(data.password);
    if (!passwordValidation.valid) {
      errors.push(passwordValidation.message || 'Invalid password');
    }
    if (data.password.length > 128) {
      errors.push('Password is too long');
    }
  }

  // Username validation (optional)
  if (data.username && typeof data.username === 'string') {
    const usernameValidation = isValidUsername(data.username);
    if (!usernameValidation.valid) {
      errors.push(usernameValidation.message || 'Invalid username');
    }
  }

  // Name validation
  if (data.firstName && typeof data.firstName === 'string') {
    if (data.firstName.length > 50) {
      errors.push('First name is too long');
    }
    if (!/^[a-zA-Z\s'-]+$/.test(data.firstName)) {
      errors.push('First name contains invalid characters');
    }
  }

  if (data.lastName && typeof data.lastName === 'string') {
    if (data.lastName.length > 50) {
      errors.push('Last name is too long');
    }
    if (!/^[a-zA-Z\s'-]+$/.test(data.lastName)) {
      errors.push('Last name contains invalid characters');
    }
  }

  return errors;
}

// Register new user
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip, 3, 15 * 60 * 1000)) { // 3 attempts per 15 minutes
      return NextResponse.json(
        { success: false, message: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { email, username, password, firstName, lastName } = await request.json();

    // Enhanced validation
    const validationErrors = validateRegistrationData({ email, username, password, firstName, lastName });
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, message: validationErrors[0] },
        { status: 400 }
      );
    }

    // Check if user already exists by email
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Check if username is taken (only if username is provided)
    if (username) {
      const existingUserByUsername = await prisma.user.findUnique({
        where: { username: username.toLowerCase() }
      });

      if (existingUserByUsername) {
        return NextResponse.json(
          { success: false, message: 'Username is already taken' },
          { status: 409 }
        );
      }
    }

    // Hash password with higher salt rounds for better security
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username ? username.toLowerCase() : null,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        role: 'ARTIST',
        isEmailVerified: false
      }
    });

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      website: user.website,
      location: user.location,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      role: user.role
    });

    // Create session
    const sessionToken = generateSessionToken();
    await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: sessionToken,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    return NextResponse.json(createAuthResponse(user, token));

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Login user
export async function PUT(request: NextRequest) {
  try {
    // Rate limiting for login attempts
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
      return NextResponse.json(
        { success: false, message: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check for hardcoded admin accounts (for testing)
    const hardcodedAdmins = [
      {
        email: 'admin@kushtunes.com',
        password: 'Admin123!',
        user: {
          id: 'admin-001',
          email: 'admin@kushtunes.com',
          username: 'admin',
          password: '', // Not used for hardcoded admins
          firstName: 'Kush',
          lastName: 'Admin',
          avatar: null,
          bio: null,
          website: null,
          location: null,
          role: 'ADMIN',
          isEmailVerified: true,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      {
        email: 'demo@kushtunes.com',
        password: 'Demo123!',
        user: {
          id: 'demo-001',
          email: 'demo@kushtunes.com',
          username: 'demo',
          password: '', // Not used for hardcoded admins
          firstName: 'Demo',
          lastName: 'User',
          avatar: null,
          bio: null,
          website: null,
          location: null,
          role: 'ADMIN',
          isEmailVerified: true,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    ];

    let user = null;
    let isHardcodedAdmin = false;

    // Check hardcoded admins first
    const hardcodedAdmin = hardcodedAdmins.find(admin => 
      admin.email.toLowerCase() === email.toLowerCase() && admin.password === password
    );

    if (hardcodedAdmin) {
      user = hardcodedAdmin.user;
      isHardcodedAdmin = true;
    } else {
      // Find user in database
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Invalid email or password' },
          { status: 401 }
        );
      }
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Account is deactivated. Please contact support.' },
        { status: 401 }
      );
    }

    // Verify password (skip for hardcoded admins)
    if (!isHardcodedAdmin && 'password' in user && user.password) {
      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: 'Invalid email or password' },
          { status: 401 }
        );
      }
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      website: user.website,
      location: user.location,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      role: user.role
    });

    // Create session
    const sessionToken = generateSessionToken();
    await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: sessionToken,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    return NextResponse.json(createAuthResponse(user, token));

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Get current user
export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        website: true,
        location: true,
        isEmailVerified: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Logout user
export async function DELETE(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Delete all sessions for the user
    await prisma.session.deleteMany({
      where: { userId: decoded.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';