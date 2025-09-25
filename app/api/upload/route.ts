import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

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

    // Generate unique IDs
    const releaseId = randomUUID();
    const audioId = randomUUID();
    const artworkId = randomUUID();

    // In a real implementation, you would upload to S3/Backblaze here
    // For now, we'll simulate the upload process
    const audioUrl = `https://kushtunes-storage.com/audio/${audioId}.${audioFile.name.split('.').pop()}`;
    const artworkUrl = `https://kushtunes-storage.com/artwork/${artworkId}.${artworkFile.name.split('.').pop()}`;

    // Generate ISRC and UPC codes
    const isrc = `USRC${Date.now().toString().slice(-8)}`;
    const upc = `${Math.floor(Math.random() * 900000000000) + 100000000000}`;

    // Create release in database
    const release = await prisma.release.create({
      data: {
        id: releaseId,
        title,
        artist,
        type: releaseType as any,
        status: 'READY',
        plannedAt: releaseDate ? new Date(releaseDate) : new Date(),
        coverUrl: artworkUrl,
        audioUrl,
        genre,
        language,
        releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
        isrc,
        upc
      }
    });

    // Create track record
    await prisma.track.create({
      data: {
        id: audioId,
        releaseId,
        title,
        isrc,
        audioUrl,
        duration: Math.floor(Math.random() * 300) + 120 // Random duration 2-7 minutes
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Release uploaded successfully',
      data: {
        releaseId: release.id,
        title: release.title,
        artist: release.artist,
        status: release.status,
        audioUrl: release.audioUrl,
        coverUrl: release.coverUrl,
        isrc: release.isrc,
        upc: release.upc,
        uploadedAt: release.createdAt
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
          distributions: {
            include: {
              analytics: {
                orderBy: { date: 'desc' },
                take: 30
              }
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

      return NextResponse.json({
        success: true,
        data: release
      });
    } else {
      // Get all releases
      const releases = await prisma.release.findMany({
        include: {
          tracks: true,
          distributions: {
            include: {
              analytics: {
                orderBy: { date: 'desc' },
                take: 7
              }
            }
          }
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