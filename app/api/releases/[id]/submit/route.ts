import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// POST /api/releases/:id/submit - Submit release for distribution
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { id } = params;
    const { stores } = await request.json(); // Array of store names

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

    // Check if release belongs to artist
    const release = await prisma.release.findFirst({
      where: {
        id,
        primaryArtistId: artist.id
      },
      include: {
        tracks: {
          include: {
            contributors: true,
            splits: true
          }
        }
      }
    });

    if (!release) {
      return NextResponse.json(
        { success: false, message: 'Release not found' },
        { status: 404 }
      );
    }

    // Validate release is ready for submission
    const validation = await validateReleaseForSubmission(release);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    // Create delivery records for each store
    const deliveries = await Promise.all(
      stores.map((store: string) =>
        prisma.delivery.create({
          data: {
            releaseId: id,
            store,
            status: 'PENDING',
            submittedAt: new Date()
          }
        })
      )
    );

    // Update release status to UNDER_REVIEW
    await prisma.release.update({
      where: { id },
      data: {
        status: 'UNDER_REVIEW',
        updatedAt: new Date()
      }
    });

    // Generate delivery package (CSV/JSON metadata)
    const deliveryPackage = await generateDeliveryPackage(release);

    return NextResponse.json({
      success: true,
      message: 'Release submitted for review',
      data: {
        releaseId: id,
        status: 'UNDER_REVIEW',
        deliveries: deliveries.map(d => ({
          id: d.id,
          store: d.store,
          status: d.status
        })),
        deliveryPackage: {
          metadata: deliveryPackage.metadata,
          assets: deliveryPackage.assets
        }
      }
    });

  } catch (error) {
    console.error('Submit release error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
async function validateReleaseForSubmission(release: any): Promise<{ valid: boolean; error?: string }> {
  // Check if release has required fields
  if (!release.title) {
    return { valid: false, error: 'Release title is required' };
  }

  if (!release.upc) {
    return { valid: false, error: 'UPC is required' };
  }

  if (!release.coverUrl) {
    return { valid: false, error: 'Cover art is required' };
  }

  // Check if release has tracks
  if (!release.tracks || release.tracks.length === 0) {
    return { valid: false, error: 'Release must have at least one track' };
  }

  // Validate each track
  for (const track of release.tracks) {
    if (!track.title) {
      return { valid: false, error: `Track ${track.trackNumber} title is required` };
    }

    if (!track.isrc) {
      return { valid: false, error: `Track ${track.trackNumber} ISRC is required` };
    }

    if (!track.audioUrl) {
      return { valid: false, error: `Track ${track.trackNumber} audio file is required` };
    }

    if (!track.duration || track.duration <= 0) {
      return { valid: false, error: `Track ${track.trackNumber} duration is required` };
    }
  }

  // Check release date is in the future
  if (release.releaseDate <= new Date()) {
    return { valid: false, error: 'Release date must be in the future' };
  }

  return { valid: true };
}

async function generateDeliveryPackage(release: any): Promise<{ metadata: any; assets: any }> {
  // Generate metadata package (CSV/JSON format)
  const metadata = {
    release: {
      upc: release.upc,
      title: release.title,
      version: release.version,
      label: release.label,
      releaseDate: release.releaseDate,
      territories: release.territories,
      genre: release.genre,
      subgenre: release.subgenre,
      copyrightYear: release.copyrightYear,
      pLine: release.pLine,
      cLine: release.cLine
    },
    tracks: release.tracks.map((track: any) => ({
      isrc: track.isrc,
      title: track.title,
      version: track.version,
      trackNumber: track.trackNumber,
      explicit: track.explicit,
      language: track.language,
      duration: track.duration,
      contributors: track.contributors.map((c: any) => ({
        name: c.name,
        role: c.role,
        ipi: c.ipi
      })),
      splits: track.splits.map((s: any) => ({
        percent: s.percent,
        recoupmentFlag: s.recoupmentFlag
      }))
    }))
  };

  // Generate assets package
  const assets = {
    coverArt: release.coverUrl,
    audioFiles: release.tracks.map((track: any) => ({
      trackId: track.id,
      isrc: track.isrc,
      title: track.title,
      audioUrl: track.audioUrl
    }))
  };

  return { metadata, assets };
}
