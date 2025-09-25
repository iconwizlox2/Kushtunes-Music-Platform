import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import sharp from 'sharp';
import { 
  validateAudioFile, 
  validateImageFile, 
  generateFileId, 
  generateSafeFilename,
  saveUploadedFile,
  processAudioMetadata,
  processImageMetadata,
  generateFileHash,
  checkFileExists,
  cleanupTempFiles
} from '@/lib/upload-logic';
import { 
  generateReleaseId, 
  generateUPC, 
  generateISRC,
  validateReleaseMetadata,
  validateTrack,
  validateReleaseForDistribution,
  calculateReleaseDuration,
  formatDuration
} from '@/lib/release-logic';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// Optimize image - Standard cover art dimensions
async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer)
    .resize(3000, 3000, { 
      fit: 'cover', // Ensure square aspect ratio
      withoutEnlargement: true 
    })
    .jpeg({ 
      quality: 85, // Reduced for smaller file size
      progressive: true,
      mozjpeg: true // Better compression
    })
    .toBuffer();
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

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    // Extract track data
    const tracks: Array<{ title: string; audioFile: File }> = [];
    let trackIndex = 0;
    while (formData.has(`track_${trackIndex}`)) {
      const audioFile = formData.get(`track_${trackIndex}`) as File;
      const title = formData.get(`track_${trackIndex}_title`) as string;
      
      if (audioFile && title) {
        tracks.push({ title, audioFile });
      }
      trackIndex++;
    }

    // Extract metadata
    const metadata = {
      title: formData.get('title') as string,
      artist: formData.get('artist') as string,
      releaseDate: formData.get('releaseDate') as string,
      genre: formData.get('genre') as string,
      language: formData.get('language') as string,
      type: ((formData.get('type') as string) || 'SINGLE') as 'SINGLE' | 'EP' | 'ALBUM'
    };

    const artworkFile = formData.get('artwork') as File;

    // Validate required fields
    if (!tracks.length || !metadata.title || !metadata.artist || !artworkFile) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate release metadata
    const metadataValidation = validateReleaseMetadata(metadata);
    if (!metadataValidation.valid) {
      return NextResponse.json(
        { success: false, message: metadataValidation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Validate all audio files
    const audioValidations = tracks.map(track => validateAudioFile(track.audioFile));
    const invalidAudio = audioValidations.find(v => !v.valid);
    if (invalidAudio) {
      return NextResponse.json(
        { success: false, message: invalidAudio.error },
        { status: 400 }
      );
    }

    // Validate artwork file
    const imageValidation = validateImageFile(artworkFile);
    if (!imageValidation.valid) {
      return NextResponse.json(
        { success: false, message: imageValidation.error },
        { status: 400 }
      );
    }

    // Generate unique IDs
    const releaseId = generateReleaseId();
    const upc = generateUPC();
    const tempFilePaths: string[] = [];

    try {
      // Process and save artwork
      const artworkBuffer = Buffer.from(await artworkFile.arrayBuffer());
      const optimizedImage = await optimizeImage(artworkBuffer);
      const artworkFileId = generateFileId();
      const artworkFilename = generateSafeFilename(artworkFile.name, artworkFileId);
      
      // Save artwork (in production, upload to cloud storage)
      const artworkPath = `/uploads/${user.id}/images/${artworkFilename}`;
      tempFilePaths.push(artworkPath);

      // Process artwork metadata
      const artworkMetadata = await processImageMetadata(artworkPath);

      // Create release in database
      const release = await prisma.release.create({
        data: {
          id: releaseId,
          primaryArtistId: user.id,
          title: metadata.title,
          releaseDate: new Date(metadata.releaseDate),
          status: 'DRAFT',
          coverUrl: `https://kushtunes-storage.com/artwork/${artworkFileId}.jpg`,
          genre: metadata.genre,
          territories: JSON.stringify(['US']),
          upc: upc
        }
      });

      // Process and save tracks
      const trackRecords = [];
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const trackId = generateFileId();
        const isrc = generateISRC();
        
        // Save audio file (in production, upload to cloud storage)
        const audioPath = `/uploads/${user.id}/audio/${generateSafeFilename(track.audioFile.name, trackId)}`;
        tempFilePaths.push(audioPath);
        
        // Process audio metadata
        const audioMetadata = await processAudioMetadata(audioPath);
        
        // Create track record
        const trackRecord = await prisma.track.create({
          data: {
            id: trackId,
            releaseId,
            title: track.title,
            trackNumber: i + 1,
            isrc,
            audioUrl: `https://kushtunes-storage.com/audio/${trackId}.${track.audioFile.name.split('.').pop()}`,
            duration: audioMetadata.duration || 180,
            language: metadata.language,
            bitrate: audioMetadata.bitrate,
            sampleRate: audioMetadata.sampleRate,
            channels: audioMetadata.channels
          }
        });
        
        trackRecords.push(trackRecord);
      }

      // Calculate release duration
      const totalDuration = calculateReleaseDuration(trackRecords.map(t => ({ duration: t.duration })));

      return NextResponse.json({
        success: true,
        message: 'Release uploaded successfully',
        data: {
          releaseId: release.id,
          title: release.title,
          status: release.status,
          coverUrl: release.coverUrl,
          upc: release.upc,
          uploadedAt: release.createdAt,
          tracks: trackRecords.map(track => ({
            id: track.id,
            title: track.title,
            trackNumber: track.trackNumber,
            duration: formatDuration(track.duration),
            isrc: track.isrc
          })),
          summary: {
            trackCount: trackRecords.length,
            totalDuration: formatDuration(totalDuration),
            releaseType: metadata.type
          },
          fileInfo: {
            audioFiles: tracks.map(t => ({
              name: t.audioFile.name,
              size: t.audioFile.size,
              type: t.audioFile.type
            })),
            artwork: {
              name: artworkFile.name,
              size: optimizedImage.length,
              type: 'image/jpeg',
              dimensions: `${artworkMetadata.width}x${artworkMetadata.height}`
            }
          }
        }
      });

    } catch (error) {
      // Clean up temporary files on error
      await cleanupTempFiles(tempFilePaths);
      throw error;
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}

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

    if (releaseId) {
      // Get specific release for authenticated user
      const release = await prisma.release.findFirst({
        where: { 
          id: releaseId,
          primaryArtistId: user.id
        },
        include: {
          tracks: {
            orderBy: { trackNumber: 'asc' }
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

      // Calculate release analytics
      const totalDuration = calculateReleaseDuration(release.tracks.map(t => ({ duration: t.duration })));

      return NextResponse.json({
        success: true,
        data: {
          ...release,
          summary: {
            trackCount: release.tracks.length,
            totalDuration: formatDuration(totalDuration),
            releaseType: release.releaseType || 'SINGLE'
          },
          tracks: release.tracks.map(track => ({
            ...track,
            duration: formatDuration(track.duration)
          }))
        }
      });
    } else {
      // Get all releases for authenticated user
      const releases = await prisma.release.findMany({
        where: {
          primaryArtistId: user.id
        },
        include: {
          tracks: {
            orderBy: { trackNumber: 'asc' }
          },
          deliveries: true
        },
        orderBy: { createdAt: 'desc' }
      });

      // Add summary data to each release
      const releasesWithSummary = releases.map(release => {
        const totalDuration = calculateReleaseDuration(release.tracks.map(t => ({ duration: t.duration })));
        
        return {
          ...release,
          summary: {
            trackCount: release.tracks.length,
            totalDuration: formatDuration(totalDuration),
            releaseType: release.releaseType || 'SINGLE'
          },
          tracks: release.tracks.map(track => ({
            ...track,
            duration: formatDuration(track.duration)
          }))
        };
      });

      return NextResponse.json({
        success: true,
        data: releasesWithSummary,
        count: releases.length
      });
    }

  } catch (error) {
    console.error('Release fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}