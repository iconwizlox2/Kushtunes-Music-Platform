import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

const prisma = new PrismaClient();

// File size limits (in bytes) - Standard industry limits
const MAX_AUDIO_SIZE = 50 * 1024 * 1024;  // 50MB (standard limit)
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;   // 2MB (standard cover art limit)

// Allowed file types
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp3'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Validate file type and size
function validateFile(file: File, type: 'audio' | 'image') {
  const maxSize = type === 'audio' ? MAX_AUDIO_SIZE : MAX_IMAGE_SIZE;
  const allowedTypes = type === 'audio' ? ALLOWED_AUDIO_TYPES : ALLOWED_IMAGE_TYPES;
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${type === 'audio' ? '50MB' : '2MB'}`
    };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`
    };
  }
  
  return { valid: true };
}

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
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const artworkFile = formData.get('artwork') as File;
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string;
    const genre = formData.get('genre') as string;
    const language = formData.get('language') as string;
    const releaseDate = formData.get('releaseDate') as string;
    const releaseType = formData.get('releaseType') as string || 'SINGLE';

    if (!audioFile || !artworkFile || !title || !artist) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate audio file
    const audioValidation = validateFile(audioFile, 'audio');
    if (!audioValidation.valid) {
      return NextResponse.json(
        { success: false, message: audioValidation.error },
        { status: 400 }
      );
    }

    // Validate artwork file
    const imageValidation = validateFile(artworkFile, 'image');
    if (!imageValidation.valid) {
      return NextResponse.json(
        { success: false, message: imageValidation.error },
        { status: 400 }
      );
    }

    // Generate unique IDs
    const releaseId = randomUUID();
    const audioId = randomUUID();
    const artworkId = randomUUID();

    // Process and optimize image
    const imageBuffer = Buffer.from(await artworkFile.arrayBuffer());
    const optimizedImage = await optimizeImage(imageBuffer);
    
    // Convert audio file to buffer
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    // In production, you would upload to cloud storage here
    // For now, we'll simulate the upload process with proper URLs
    const audioUrl = `https://kushtunes-storage.com/audio/${audioId}.${audioFile.name.split('.').pop()}`;
    const artworkUrl = `https://kushtunes-storage.com/artwork/${artworkId}.jpg`;

    // Generate ISRC and UPC codes
    const isrc = `USRC${Date.now().toString().slice(-8)}`;
    const upc = `${Math.floor(Math.random() * 900000000000) + 100000000000}`;

    // Create release in database
    const release = await prisma.release.create({
      data: {
        id: releaseId,
        primaryArtistId: 'demo-artist-id', // TODO: Get from authenticated user
        title,
        releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
        status: 'DRAFT',
        coverUrl: artworkUrl,
        genre,
        territories: ['US'], // Default territory
        upc
      }
    });

    // Create track record
    await prisma.track.create({
      data: {
        id: audioId,
        releaseId,
        title,
        trackNumber: 1, // Default to track 1
        isrc,
        audioUrl,
        duration: Math.floor(Math.random() * 300) + 120, // Random duration 2-7 minutes
        language: 'en' // Default language
      }
    });

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
        fileInfo: {
          audioSize: audioFile.size,
          imageSize: optimizedImage.length,
          audioType: audioFile.type,
          imageType: 'image/jpeg'
        }
      }
    });

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
    const { searchParams } = new URL(request.url);
    const releaseId = searchParams.get('releaseId');

    if (releaseId) {
      // Get specific release
      const release = await prisma.release.findUnique({
        where: { id: releaseId },
        include: {
          tracks: true,
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
        data: release
      });
    } else {
      // Get all releases
      const releases = await prisma.release.findMany({
        include: {
          tracks: true,
          deliveries: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({
        success: true,
        data: releases
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