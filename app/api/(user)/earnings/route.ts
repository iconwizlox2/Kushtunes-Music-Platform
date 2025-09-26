import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import { 
  generateEarningsSummary,
  calculateStreamEarnings,
  validatePayoutRequest,
  calculatePayoutFees,
  formatCurrency,
  getPayoutStatusColor,
  getPayoutStatusText,
  generateEarningsInsights
} from '@/lib/payout-logic';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Extract and verify authentication token
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') as 'daily' | 'weekly' | 'monthly' || 'monthly';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build date filter
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    // Get user's releases
    const releases = await prisma.release.findMany({
      where: {
        primaryArtistId: user.id
      },
      include: {
        tracks: true
      }
    });

    const trackIds = releases.flatMap(r => r.tracks.map(t => t.id));

    // Generate mock earnings data
    const earningsData = generateMockEarningsData(user.id, trackIds, dateFilter);
    
    // Get payout history
    const payoutData = await prisma.payout.findMany({
      where: {
        artistId: user.id
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform payout data to match expected format
    const transformedPayoutData = payoutData.map(payout => ({
      id: payout.id,
      userId: payout.artistId,
      amount: payout.amount,
      currency: 'USD',
      requestedAt: payout.createdAt,
      paymentMethod: payout.method,
      status: payout.status === 'APPROVED' ? 'PROCESSING' : 
              payout.status === 'PROCESSED' ? 'COMPLETED' : 
              payout.status as 'PENDING' | 'FAILED' | 'PROCESSING' | 'COMPLETED',
      processedAt: payout.processedAt || undefined,
      reference: payout.reference
    }));

    // Generate earnings summary
    const summary = generateEarningsSummary(earningsData, transformedPayoutData);
    const insights = generateEarningsInsights(summary);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          ...summary,
          insights
        },
        payoutHistory: payoutData.map(payout => {
          const mappedStatus = payout.status === 'APPROVED' ? 'PROCESSING' : 
                              payout.status === 'PROCESSED' ? 'COMPLETED' : 
                              payout.status as 'PENDING' | 'FAILED' | 'PROCESSING' | 'COMPLETED';
          return {
            ...payout,
            status: mappedStatus,
            statusColor: getPayoutStatusColor(mappedStatus),
            statusText: getPayoutStatusText(mappedStatus)
          };
        }),
        releases: releases.map(release => ({
          id: release.id,
          title: release.title,
          trackCount: release.tracks.length,
          releaseDate: release.releaseDate
        }))
      }
    });

  } catch (error) {
    console.error('Earnings error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch earnings data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Extract and verify authentication token
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, paymentMethod, currency = 'USD' } = body;

    if (!amount || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: 'Amount and payment method are required' },
        { status: 400 }
      );
    }

    // Get user's earnings data
    const releases = await prisma.release.findMany({
      where: {
        primaryArtistId: user.id
      },
      include: {
        tracks: true
      }
    });

    const trackIds = releases.flatMap(r => r.tracks.map(t => t.id));
    const earningsData = generateMockEarningsData(user.id, trackIds);
    const payoutData = await prisma.payout.findMany({
      where: {
        artistId: user.id
      }
    });

    // Transform payout data to match expected format
    const transformedPayoutData = payoutData.map(payout => ({
      id: payout.id,
      userId: payout.artistId,
      amount: payout.amount,
      currency: 'USD',
      requestedAt: payout.createdAt,
      paymentMethod: payout.method,
      status: payout.status === 'APPROVED' ? 'PROCESSING' : 
              payout.status === 'PROCESSED' ? 'COMPLETED' : 
              payout.status as 'PENDING' | 'FAILED' | 'PROCESSING' | 'COMPLETED',
      processedAt: payout.processedAt || undefined,
      reference: payout.reference
    }));

    const summary = generateEarningsSummary(earningsData, transformedPayoutData);
    const availableBalance = summary.availableBalance;

    // Validate payout request
    const validation = validatePayoutRequest(amount, availableBalance);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    // Calculate fees
    const { fee, netAmount } = calculatePayoutFees(amount, paymentMethod);

    // Create payout record
    const payout = await prisma.payout.create({
      data: {
        artistId: user.id,
        amount: parseFloat(amount),
        method: paymentMethod,
        status: 'PENDING',
        reference: `PAYOUT_${Date.now()}`
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Payout request submitted successfully',
      data: {
        payoutId: payout.id,
        amount: formatCurrency(payout.amount, 'USD'),
        fee: formatCurrency(fee, 'USD'),
        netAmount: formatCurrency(netAmount, 'USD'),
        status: getPayoutStatusText(payout.status === 'APPROVED' ? 'PROCESSING' : 
                                    payout.status === 'PROCESSED' ? 'COMPLETED' : 
                                    payout.status as 'PENDING' | 'FAILED' | 'PROCESSING' | 'COMPLETED'),
        requestedAt: payout.createdAt,
        estimatedProcessingTime: '3-5 business days'
      }
    });

  } catch (error) {
    console.error('Payout request error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process payout request' },
      { status: 500 }
    );
  }
}

// Generate mock earnings data for demonstration
function generateMockEarningsData(userId: string, trackIds: string[], dateFilter: any = {}) {
  const platforms = ['spotify', 'apple-music', 'youtube-music', 'amazon-music', 'deezer'];
  const countries = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE'];
  
  const earningsData: any[] = [];
  const startDate = dateFilter.gte || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
  const endDate = dateFilter.lte || new Date();
  
  // Generate data for each track
  trackIds.forEach(trackId => {
    // Generate daily data for the specified period
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      platforms.forEach(platform => {
        countries.forEach(country => {
          const streams = Math.floor(Math.random() * 1000) + 100;
          const earnings = calculateStreamEarnings(platform, country, streams);
          
          earningsData.push({
            id: `${trackId}_${platform}_${country}_${d.toISOString().split('T')[0]}`,
            userId,
            releaseId: trackId.split('_')[0],
            trackId,
            platform,
            country,
            date: new Date(d),
            streams,
            revenue: earnings.revenue,
            currency: 'USD',
            payoutRate: earnings.rate,
            netEarnings: earnings.revenue // Assuming 100% royalty rate
          });
        });
      });
    }
  });
  
  return earningsData;
}