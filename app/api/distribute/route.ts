import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DSP_CONFIGS = {
  CDBABY_ALL: {
    name: 'CD Baby (100+ Platforms)',
    platforms: ['Spotify', 'Apple Music', 'Amazon Music', 'YouTube Music', 'Tidal', 'Deezer', 'Pandora', 'iTunes', 'Google Play Music', 'SoundCloud', 'Bandcamp', 'Napster', 'iHeartRadio', 'Slacker', 'Mixcloud', '8tracks', 'Jango', 'Last.fm', 'Grooveshark', 'Rdio'],
    estimatedTime: '2-4 weeks',
    cost: '$9.95 per single, $29 per album',
    successRate: 0.95,
    revenueShare: 0.91
  },
  AMUSE_FREE: {
    name: 'Amuse (Free - Major Platforms)',
    platforms: ['Spotify', 'Apple Music', 'Amazon Music', 'YouTube Music', 'Deezer', 'Tidal'],
    estimatedTime: '1-2 weeks',
    cost: '100% FREE',
    successRate: 0.88,
    revenueShare: 1.0
  },
  SPOTIFY: {
    name: 'Spotify Direct',
    platforms: ['Spotify'],
    estimatedTime: '1-2 weeks',
    cost: 'Free (with API)',
    successRate: 0.92,
    revenueShare: 0.7
  },
  APPLE_MUSIC: {
    name: 'Apple Music Direct',
    platforms: ['Apple Music'],
    estimatedTime: '1-2 weeks',
    cost: 'Free (with API)',
    successRate: 0.90,
    revenueShare: 0.7
  }
};

export async function POST(request: NextRequest) {
  try {
    const { releaseId, dsp, releaseData } = await request.json();

    if (!releaseId || !dsp) {
      return NextResponse.json(
        { success: false, message: 'Missing releaseId or dsp' },
        { status: 400 }
      );
    }

    const dspConfig = DSP_CONFIGS[dsp as keyof typeof DSP_CONFIGS];
    if (!dspConfig) {
      return NextResponse.json(
        { success: false, message: 'Invalid DSP choice' },
        { status: 400 }
      );
    }

    // Create distribution record in database
    const distribution = await prisma.dSPDistribution.create({
      data: {
        releaseId,
        dsp,
        dspName: dspConfig.name,
        status: 'SUBMITTED',
        submissionId: `${dsp.toLowerCase()}_${Date.now()}`,
        platformUrls: {
          platforms: dspConfig.platforms,
          estimatedTime: dspConfig.estimatedTime,
          cost: dspConfig.cost
        },
        metadata: {
          successRate: dspConfig.successRate,
          revenueShare: dspConfig.revenueShare,
          submittedAt: new Date().toISOString(),
          releaseData: releaseData || {}
        }
      }
    });

    // Simulate processing time based on DSP
    const processingTime = dspConfig.estimatedTime === '1-2 weeks' ? 7 : 21; // days
    
    // Schedule status updates (in real implementation, this would be handled by background jobs)
    setTimeout(async () => {
      await prisma.dSPDistribution.update({
        where: { id: distribution.id },
        data: { status: 'PROCESSING' }
      });
    }, 1000 * 60 * 60 * 24); // 1 day

    setTimeout(async () => {
      await prisma.dSPDistribution.update({
        where: { id: distribution.id },
        data: { 
          status: 'LIVE',
          liveAt: new Date(),
          platformUrls: {
            ...distribution.platformUrls as any,
            spotifyUrl: `https://open.spotify.com/track/${Math.random().toString(36).substr(2, 22)}`,
            appleMusicUrl: `https://music.apple.com/us/album/${Math.random().toString(36).substr(2, 22)}`,
            amazonUrl: `https://music.amazon.com/albums/${Math.random().toString(36).substr(2, 22)}`,
            youtubeUrl: `https://music.youtube.com/watch?v=${Math.random().toString(36).substr(2, 22)}`
          }
        }
      });
    }, 1000 * 60 * 60 * 24 * processingTime); // Processing time

    return NextResponse.json({
      success: true,
      message: 'Distribution initiated successfully',
      data: {
        id: distribution.id,
        dsp: dspConfig.name,
        status: 'SUBMITTED',
        platforms: dspConfig.platforms,
        estimatedTime: dspConfig.estimatedTime,
        cost: dspConfig.cost,
        submissionId: distribution.submissionId,
        submittedAt: distribution.submittedAt
      }
    });

  } catch (error) {
    console.error('Distribution error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const releaseId = searchParams.get('releaseId');

    if (!releaseId) {
      return NextResponse.json(
        { success: false, message: 'Release ID is required' },
        { status: 400 }
      );
    }

    const distributions = await prisma.dSPDistribution.findMany({
      where: { releaseId },
      include: {
        analytics: {
          orderBy: { date: 'desc' },
          take: 30 // Last 30 days
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: distributions
    });

  } catch (error) {
    console.error('Distribution fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
