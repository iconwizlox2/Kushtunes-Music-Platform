import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/earnings - Get earnings for a period
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
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period'); // YYYY-MM format
    const artistId = searchParams.get('artistId');

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

    // Build query
    const whereClause: any = {};
    
    if (period) {
      whereClause.period = period;
    }

    // Get earnings for artist's tracks
    const earnings = await prisma.earning.findMany({
      where: {
        ...whereClause,
        track: {
          release: {
            primaryArtistId: artist.id
          }
        }
      },
      include: {
        track: {
          include: {
            release: true
          }
        }
      },
      orderBy: {
        period: 'desc'
      }
    });

    // Calculate totals
    const totals = earnings.reduce((acc, earning) => {
      acc.totalUnits += earning.units;
      acc.totalRevenue += earning.revenue;
      return acc;
    }, { totalUnits: 0, totalRevenue: 0 });

    // Group by period
    const earningsByPeriod = earnings.reduce((acc, earning) => {
      if (!acc[earning.period]) {
        acc[earning.period] = {
          period: earning.period,
          units: 0,
          revenue: 0,
          stores: new Set(),
          countries: new Set()
        };
      }
      acc[earning.period].units += earning.units;
      acc[earning.period].revenue += earning.revenue;
      acc[earning.period].stores.add(earning.store);
      acc[earning.period].countries.add(earning.country);
      return acc;
    }, {} as any);

    // Convert sets to arrays
    Object.values(earningsByPeriod).forEach((period: any) => {
      period.stores = Array.from(period.stores);
      period.countries = Array.from(period.countries);
    });

    return NextResponse.json({
      success: true,
      data: {
        earnings: earningsByPeriod,
        totals,
        period: period || 'all'
      }
    });

  } catch (error) {
    console.error('Get earnings error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
