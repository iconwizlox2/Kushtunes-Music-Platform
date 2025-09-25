import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import { 
  generateAnalyticsSummary,
  calculateTrackAnalytics,
  calculateReleaseAnalytics,
  generatePerformanceInsights,
  getTimeBasedAnalytics,
  calculateTotalStreams,
  calculateTotalRevenue,
  formatCurrency,
  formatNumber
} from '@/lib/analytics-logic';

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

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const releaseId = searchParams.get('releaseId');
    const trackId = searchParams.get('trackId');
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

    const releaseIds = releases.map(r => r.id);
    const trackIds = releases.flatMap(r => r.tracks.map(t => t.id));

    if (releaseId) {
      // Get analytics for specific release
      const release = releases.find(r => r.id === releaseId);
      if (!release) {
        return NextResponse.json(
          { success: false, message: 'Release not found' },
          { status: 404 }
        );
      }

      // Mock stream data for the release
      const streamData = generateMockStreamData(releaseId, trackIds, dateFilter);
      const analytics = calculateReleaseAnalytics(releaseId, streamData, release);

      return NextResponse.json({
        success: true,
        data: {
          release: {
            id: release.id,
            title: release.title,
            releaseDate: release.releaseDate,
            status: release.status
          },
          analytics: {
            ...analytics,
            insights: generatePerformanceInsights({
              totalStreams: analytics.totalStreams,
              totalRevenue: analytics.totalRevenue,
              totalTracks: analytics.trackCount,
              totalReleases: 1,
              topCountries: analytics.tracks.reduce((acc: any[], track: any) => [...acc, ...(track.topCountries || [])], []),
              topPlatforms: analytics.tracks.reduce((acc: any[], track: any) => [...acc, ...(track.topPlatforms || [])], []),
              monthlyGrowth: []
            })
          }
        }
      });
    }

    if (trackId) {
      // Get analytics for specific track
      const track = releases.flatMap(r => r.tracks).find(t => t.id === trackId);
      if (!track) {
        return NextResponse.json(
          { success: false, message: 'Track not found' },
          { status: 404 }
        );
      }

      // Mock stream data for the track
      const streamData = generateMockStreamData(releaseId, [trackId], dateFilter);
      const analytics = calculateTrackAnalytics(trackId, streamData, track.title);

      return NextResponse.json({
        success: true,
        data: {
          track: {
            id: track.id,
            title: track.title,
            releaseId: track.releaseId
          },
          analytics
        }
      });
    }

    // Get overall analytics for user
    const streamData = generateMockStreamData(null, trackIds, dateFilter);
    const analytics = generateAnalyticsSummary(streamData, releases, releases.flatMap(r => r.tracks));
    const insights = generatePerformanceInsights(analytics);
    const timeBasedAnalytics = getTimeBasedAnalytics(streamData, period);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          ...analytics,
          insights,
          timeBasedAnalytics
        },
        releases: releases.map(release => ({
          id: release.id,
          title: release.title,
          status: release.status,
          trackCount: release.tracks.length,
          releaseDate: release.releaseDate
        }))
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// Generate mock stream data for demonstration
function generateMockStreamData(releaseId: string | null, trackIds: string[], dateFilter: any) {
  const platforms = ['spotify', 'apple-music', 'youtube-music', 'amazon-music', 'deezer'];
  const countries = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE'];
  
  const streamData: any[] = [];
  const startDate = dateFilter.gte || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
  const endDate = dateFilter.lte || new Date();
  
  // Generate data for each track
  trackIds.forEach(trackId => {
    if (releaseId && !trackId.startsWith(releaseId)) return;
    
    // Generate daily data for the last 90 days
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      platforms.forEach(platform => {
        countries.forEach(country => {
          const streams = Math.floor(Math.random() * 1000) + 100;
          const revenue = streams * (Math.random() * 0.01 + 0.003); // $0.003-$0.013 per stream
          
          streamData.push({
            id: `${trackId}_${platform}_${country}_${d.toISOString().split('T')[0]}`,
            releaseId: releaseId || trackId.split('_')[0],
            trackId,
            platform,
            country,
            date: new Date(d),
            streams,
            revenue: Math.round(revenue * 100) / 100,
            currency: 'USD'
          });
        });
      });
    }
  });
  
  return streamData;
}