import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock analytics data that matches the admin page structure
    const analytics = {
      overview: {
        totalUsers: 1250,
        totalReleases: 89,
        totalStreams: 2500000,
        totalRevenue: 45000,
        activeUsers: 850,
        newUsersToday: 12,
        releasesToday: 3,
        revenueToday: 1250
      },
      charts: {
        usersGrowth: [
          { month: 'Jan', users: 800 },
          { month: 'Feb', users: 920 },
          { month: 'Mar', users: 1050 },
          { month: 'Apr', users: 1180 },
          { month: 'May', users: 1250 },
          { month: 'Jun', users: 1350 }
        ],
        revenueGrowth: [
          { month: 'Jan', revenue: 25000 },
          { month: 'Feb', revenue: 28000 },
          { month: 'Mar', revenue: 32000 },
          { month: 'Apr', revenue: 38000 },
          { month: 'May', revenue: 42000 },
          { month: 'Jun', revenue: 45000 }
        ],
        topGenres: [
          { genre: 'Pop', releases: 25, streams: 800000 },
          { genre: 'Hip-Hop', releases: 18, streams: 650000 },
          { genre: 'Electronic', releases: 15, streams: 450000 },
          { genre: 'Rock', releases: 12, streams: 350000 },
          { genre: 'R&B', releases: 10, streams: 250000 }
        ],
        topCountries: [
          { country: 'United States', users: 450, revenue: 18000 },
          { country: 'United Kingdom', users: 180, revenue: 8500 },
          { country: 'Canada', users: 120, revenue: 6200 },
          { country: 'Germany', users: 95, revenue: 4800 },
          { country: 'Australia', users: 80, revenue: 4200 }
        ]
      },
      recentActivity: [
        {
          id: '1',
          type: 'release',
          message: 'New release "Summer Vibes" uploaded by Artist123',
          timestamp: new Date(),
          status: 'success'
        },
        {
          id: '2',
          type: 'stream',
          message: 'Release "Midnight Dreams" reached 100K streams',
          timestamp: new Date(Date.now() - 3600000),
          status: 'success'
        },
        {
          id: '3',
          type: 'user',
          message: 'New user registration: MusicProducer2024',
          timestamp: new Date(Date.now() - 7200000),
          status: 'success'
        },
        {
          id: '4',
          type: 'payment',
          message: 'Payment processed for $450.25',
          timestamp: new Date(Date.now() - 10800000),
          status: 'success'
        },
        {
          id: '5',
          type: 'release',
          message: 'Release "City Lights" is processing',
          timestamp: new Date(Date.now() - 14400000),
          status: 'processing'
        }
      ]
    };

    return NextResponse.json({ success: true, data: analytics });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}