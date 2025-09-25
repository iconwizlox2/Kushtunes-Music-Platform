import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// POST /api/releases - Create new release
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

    const {
      title,
      version,
      label,
      releaseDate,
      territories,
      genre,
      subgenre,
      copyrightYear,
      pLine,
      cLine,
      tracks
    } = await request.json();

    // Validate required fields
    if (!title || !releaseDate || !tracks || tracks.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Title, release date, and tracks are required' },
        { status: 400 }
      );
    }

    // Validate release date (must be at least 7 days in future)
    const releaseDateObj = new Date(releaseDate);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7);
    
    if (releaseDateObj < minDate) {
      return NextResponse.json(
        { success: false, message: 'Release date must be at least 7 days in the future' },
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

    // Generate UPC if not provided
    const upc = generateUPC();

    // Create release with tracks in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create release
      const release = await tx.release.create({
        data: {
          upc,
          title,
          version,
          label,
          primaryArtistId: artist.id,
          releaseDate: releaseDateObj,
          territories: territories || ['US'], // Default to US if not specified
          genre,
          subgenre,
          copyrightYear,
          pLine,
          cLine,
          status: 'DRAFT'
        }
      });

      // Create tracks
      const createdTracks = [];
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const isrc = generateISRC();
        
        const createdTrack = await tx.track.create({
          data: {
            releaseId: release.id,
            isrc,
            title: track.title,
            version: track.version,
            trackNumber: i + 1,
            explicit: track.explicit || false,
            language: track.language || 'en',
            duration: track.duration,
            audioUrl: track.audioUrl,
            lyrics: track.lyrics
          }
        });

        // Create contributors if provided
        if (track.contributors && track.contributors.length > 0) {
          for (const contributor of track.contributors) {
            await tx.contributor.create({
              data: {
                trackId: createdTrack.id,
                name: contributor.name,
                role: contributor.role,
                ipi: contributor.ipi
              }
            });
          }
        }

        // Create splits if provided
        if (track.splits && track.splits.length > 0) {
          for (const split of track.splits) {
            await tx.split.create({
              data: {
                trackId: createdTrack.id,
                artistId: artist.id, // For now, all splits go to primary artist
                percent: split.percent,
                recoupmentFlag: split.recoupmentFlag || false
              }
            });
          }
        }

        createdTracks.push(createdTrack);
      }

      return { release, tracks: createdTracks };
    });

    return NextResponse.json({
      success: true,
      message: 'Release created successfully',
      data: {
        release: {
          id: result.release.id,
          upc: result.release.upc,
          title: result.release.title,
          status: result.release.status,
          releaseDate: result.release.releaseDate
        },
        tracks: result.tracks.map(track => ({
          id: track.id,
          isrc: track.isrc,
          title: track.title,
          trackNumber: track.trackNumber
        }))
      }
    });

  } catch (error) {
    console.error('Create release error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/releases/:id - Update release
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { id } = params;
    const updateData = await request.json();

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
      }
    });

    if (!release) {
      return NextResponse.json(
        { success: false, message: 'Release not found' },
        { status: 404 }
      );
    }

    // Update release
    const updatedRelease = await prisma.release.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Release updated successfully',
      data: {
        release: {
          id: updatedRelease.id,
          title: updatedRelease.title,
          status: updatedRelease.status,
          releaseDate: updatedRelease.releaseDate
        }
      }
    });

  } catch (error) {
    console.error('Update release error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/releases/:id/status - Get release status
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { id } = params;

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

    // Get release with status
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
        },
        deliveries: true
      }
    });

    if (!release) {
      return NextResponse.json(
        { success: false, message: 'Release not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        release: {
          id: release.id,
          title: release.title,
          status: release.status,
          releaseDate: release.releaseDate,
          tracks: release.tracks,
          deliveries: release.deliveries
        }
      }
    });

  } catch (error) {
    console.error('Get release status error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function generateUPC(): string {
  // Generate a 12-digit UPC
  const prefix = '123456'; // Your company prefix
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  const checkDigit = Math.floor(Math.random() * 10);
  return `${prefix}${random}${checkDigit}`;
}

function generateISRC(): string {
  // Generate ISRC format: CC-XXX-YY-NNNNN
  const countryCode = 'US';
  const registrant = 'KUSH'; // Your registrant code
  const year = new Date().getFullYear().toString().slice(-2);
  const designation = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `${countryCode}-${registrant}-${year}-${designation}`;
}