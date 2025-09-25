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

    // Create delivery record in database
    const delivery = await prisma.delivery.create({
      data: {
        releaseId,
        store: dspConfig.name,
        status: 'SUBMITTED',
        submittedAt: new Date(),
        notes: `Submitted to ${dspConfig.name} via ${dsp}`
      }
    });

    // Simulate processing time based on DSP
    const processingTime = dspConfig.estimatedTime === '1-2 weeks' ? 7 : 21; // days
    
    // Schedule status updates (in real implementation, this would be handled by background jobs)
    setTimeout(async () => {
      await prisma.delivery.update({
        where: { id: delivery.id },
        data: { status: 'PROCESSING' }
      });
    }, 1000 * 60 * 60 * 24); // 1 day

    setTimeout(async () => {
      await prisma.delivery.update({
        where: { id: delivery.id },
        data: { 
          status: 'LIVE',
          notes: `Successfully distributed to ${dspConfig.name}`
        }
      });
    }, 1000 * 60 * 60 * 24 * processingTime); // Processing time

    return NextResponse.json({
      success: true,
      message: 'Distribution initiated successfully',
      data: {
        id: delivery.id,
        store: dspConfig.name,
        status: 'SUBMITTED',
        platforms: dspConfig.platforms,
        estimatedTime: dspConfig.estimatedTime,
        cost: dspConfig.cost,
        submittedAt: delivery.submittedAt
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

    const deliveries = await prisma.delivery.findMany({
      where: { releaseId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: deliveries
    });

  } catch (error) {
    console.error('Distribution fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
