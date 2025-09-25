import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Serve public files (artwork, audio previews)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');
    const type = searchParams.get('type'); // 'artwork' or 'audio'

    if (!fileId || !type) {
      return NextResponse.json(
        { success: false, message: 'Missing file ID or type' },
        { status: 400 }
      );
    }

    // Find the release or track
    let fileUrl: string | null = null;
    let contentType: string = '';

    if (type === 'artwork') {
      const release = await prisma.release.findUnique({
        where: { id: fileId },
        select: { coverUrl: true }
      });
      
      if (release?.coverUrl) {
        fileUrl = release.coverUrl;
        contentType = 'image/jpeg';
      }
    } else if (type === 'audio') {
      const track = await prisma.track.findUnique({
        where: { id: fileId },
        select: { audioUrl: true }
      });
      
      if (track?.audioUrl) {
        fileUrl = track.audioUrl;
        contentType = 'audio/mpeg';
      }
    }

    if (!fileUrl) {
      return NextResponse.json(
        { success: false, message: 'File not found' },
        { status: 404 }
      );
    }

    // In production, you would fetch from cloud storage
    // For now, return the URL for client-side access
    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        contentType,
        size: 'unknown', // Would be fetched from storage metadata
        lastModified: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('File serving error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to serve file' },
      { status: 500 }
    );
  }
}

// Upload file to public storage
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'artwork' or 'audio'
    const releaseId = formData.get('releaseId') as string;

    if (!file || !type || !releaseId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file
    const maxSize = type === 'audio' ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB or 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: `File too large. Max size: ${type === 'audio' ? '100MB' : '10MB'}` },
        { status: 400 }
      );
    }

    // Generate unique file ID
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fileExtension = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;

    // In production, upload to cloud storage here
    const publicUrl = `https://kushtunes-storage.com/${type}/${fileName}`;

    // Update database with new file URL
    if (type === 'artwork') {
      await prisma.release.update({
        where: { id: releaseId },
        data: { coverUrl: publicUrl }
      });
    } else if (type === 'audio') {
      await prisma.track.updateMany({
        where: { releaseId },
        data: { audioUrl: publicUrl }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        fileId,
        fileName,
        url: publicUrl,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
