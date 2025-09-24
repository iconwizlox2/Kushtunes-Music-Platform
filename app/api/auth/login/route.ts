import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Mock authentication - in production, verify against database
    if (email === 'admin@kushtunes.com' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        user: {
          id: '1',
          name: 'Admin User',
          email: 'admin@kushtunes.com',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        },
        token: 'mock-jwt-token-' + Date.now()
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

