import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import sharp from 'sharp';

const prisma = new PrismaClient();

// POST /api/releases/:id/assets - Upload audio/cover assets
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

    // Parse multipart form data
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const coverFile = formData.get('cover') as File;
    const trackId = formData.get('trackId') as string;

    const results: any = {};

    // Handle audio file upload
    if (audioFile && trackId) {
      const audioValidation = await validateAudioFile(audioFile);
      if (!audioValidation.valid) {
        return NextResponse.json(
          { success: false, message: audioValidation.error },
          { status: 400 }
        );
      }

      // Upload audio file to storage
      const audioUrl = await uploadAudioFile(audioFile, `${id}/${trackId}`);
      
      // Update track with audio URL
      await prisma.track.update({
        where: { id: trackId },
        data: { audioUrl }
      });

      results.audio = {
        url: audioUrl,
        size: audioFile.size,
        type: audioFile.type
      };
    }

    // Handle cover art upload
    if (coverFile) {
      const coverValidation = await validateCoverFile(coverFile);
      if (!coverValidation.valid) {
        return NextResponse.json(
          { success: false, message: coverValidation.error },
          { status: 400 }
        );
      }

      // Process and upload cover art
      const coverUrl = await uploadCoverFile(coverFile, id);
      
      // Update release with cover URL
      await prisma.release.update({
        where: { id },
        data: { coverUrl }
      });

      results.cover = {
        url: coverUrl,
        size: coverFile.size,
        type: coverFile.type
      };
    }

    return NextResponse.json({
      success: true,
      message: 'Assets uploaded successfully',
      data: results
    });

  } catch (error) {
    console.error('Upload assets error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
async function validateAudioFile(file: File): Promise<{ valid: boolean; error?: string }> {
  // Check file type
  const allowedTypes = ['audio/wav', 'audio/wave', 'audio/x-wav', 'audio/flac', 'audio/x-flac'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only WAV and FLAC files are allowed' };
  }

  // Check file size (max 500MB)
  const maxSize = 500 * 1024 * 1024; // 500MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Audio file must be less than 500MB' };
  }

  // Additional validation could include:
  // - Sample rate check (44.1kHz)
  // - Bit depth check (16-bit or 24-bit)
  // - Stereo check
  // These would require audio analysis libraries

  return { valid: true };
}

async function validateCoverFile(file: File): Promise<{ valid: boolean; error?: string }> {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG and PNG files are allowed' };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Cover art must be less than 10MB' };
  }

  // Validate image dimensions and format
  try {
    const buffer = await file.arrayBuffer();
    const image = sharp(Buffer.from(buffer));
    const metadata = await image.metadata();

    // Check dimensions (must be 3000x3000)
    if (metadata.width !== 3000 || metadata.height !== 3000) {
      return { valid: false, error: 'Cover art must be exactly 3000x3000 pixels' };
    }

    // Check color space (must be RGB)
    if (metadata.space !== 'srgb') {
      return { valid: false, error: 'Cover art must be in RGB color space' };
    }

    // Additional checks could include:
    // - No borders/URLs/logos
    // - CMYK detection
    // - DPI check

  } catch (error) {
    return { valid: false, error: 'Invalid image file' };
  }

  return { valid: true };
}

async function uploadAudioFile(file: File, path: string): Promise<string> {
  // This would integrate with your storage solution (Backblaze B2, S3, etc.)
  // For now, return a placeholder URL
  const buffer = await file.arrayBuffer();
  
  // In a real implementation, you would:
  // 1. Upload to cloud storage
  // 2. Return the public URL
  // 3. Handle resumable uploads for large files
  
  return `https://storage.example.com/audio/${path}.${file.name.split('.').pop()}`;
}

async function uploadCoverFile(file: File, releaseId: string): Promise<string> {
  const buffer = await file.arrayBuffer();
  
  // Process image with Sharp
  const processedImage = await sharp(Buffer.from(buffer))
    .resize(3000, 3000, { fit: 'cover' })
    .jpeg({ quality: 95, mozjpeg: true })
    .toBuffer();

  // In a real implementation, you would:
  // 1. Upload processed image to cloud storage
  // 2. Return the public URL
  
  return `https://storage.example.com/covers/${releaseId}.jpg`;
}
