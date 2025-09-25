import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// POST /api/payouts/request - Request payout
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = await verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const { amount, method } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid amount is required' },
        { status: 400 }
      );
    }

    // Get artist profile
    const artist = await prisma.artist.findUnique({
      where: { email: decoded.email }
    });

    if (!artist) {
      return NextResponse.json(
        { success: false, message: 'Artist profile not found' },
        { status: 404 }
      );
    }

    // Check KYC status
    if (artist.kycStatus !== 'APPROVED') {
      return NextResponse.json(
        { success: false, message: 'KYC must be approved before requesting payouts' },
        { status: 400 }
      );
    }

    // Check if payout method is set
    if (!artist.payoutMethod) {
      return NextResponse.json(
        { success: false, message: 'Payout method must be configured' },
        { status: 400 }
      );
    }

    // Calculate available balance
    const earnings = await prisma.earning.findMany({
      where: {
        track: {
          release: {
            primaryArtistId: artist.id
          }
        }
      }
    });

    const totalEarnings = earnings.reduce((sum, earning) => sum + earning.revenue, 0);
    
    // Get total paid out
    const paidOut = await prisma.payout.aggregate({
      where: {
        artistId: artist.id,
        status: 'PROCESSED'
      },
      _sum: {
        amount: true
      }
    });

    const availableBalance = totalEarnings - (paidOut._sum.amount || 0);

    if (amount > availableBalance) {
      return NextResponse.json(
        { success: false, message: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Create payout request
    const payout = await prisma.payout.create({
      data: {
        artistId: artist.id,
        amount,
        method: method || artist.payoutMethod,
        status: 'PENDING',
        reference: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Payout request submitted',
      data: {
        payoutId: payout.id,
        amount: payout.amount,
        status: payout.status,
        reference: payout.reference,
        availableBalance
      }
    });

  } catch (error) {
    console.error('Request payout error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/payouts - Get payout history
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = await verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get artist profile
    const artist = await prisma.artist.findUnique({
      where: { email: decoded.email }
    });

    if (!artist) {
      return NextResponse.json(
        { success: false, message: 'Artist profile not found' },
        { status: 404 }
      );
    }

    // Get payout history
    const payouts = await prisma.payout.findMany({
      where: {
        artistId: artist.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate balance
    const earnings = await prisma.earning.findMany({
      where: {
        track: {
          release: {
            primaryArtistId: artist.id
          }
        }
      }
    });

    const totalEarnings = earnings.reduce((sum, earning) => sum + earning.revenue, 0);
    
    const paidOut = await prisma.payout.aggregate({
      where: {
        artistId: artist.id,
        status: 'PROCESSED'
      },
      _sum: {
        amount: true
      }
    });

    const availableBalance = totalEarnings - (paidOut._sum.amount || 0);

    return NextResponse.json({
      success: true,
      data: {
        payouts,
        balance: {
          totalEarnings,
          paidOut: paidOut._sum.amount || 0,
          availableBalance
        }
      }
    });

  } catch (error) {
    console.error('Get payouts error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
