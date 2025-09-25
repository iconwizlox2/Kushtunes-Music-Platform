import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import sharp from 'sharp';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// Upload avatar
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const avatarFile = formData.get('avatar') as File;

    if (!avatarFile) {
      return NextResponse.json(
        { success: false, message: 'Avatar file is required' },
        { status: 400 }
      );
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(avatarFile.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Allowed: JPEG, PNG, WebP' },
        { status: 400 }
      );
    }

    if (avatarFile.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File too large. Maximum size: 2MB' },
        { status: 400 }
      );
    }

    // Process and optimize image
    const imageBuffer = Buffer.from(await avatarFile.arrayBuffer());
    const optimizedImage = await sharp(imageBuffer)
      .resize(400, 400, { 
        fit: 'cover', // Square aspect ratio
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: 85,
        progressive: true,
        mozjpeg: true
      })
      .toBuffer();

    // Generate unique filename
    const avatarId = randomUUID();
    const avatarUrl = `https://kushtunes-storage.com/avatars/${avatarId}.jpg`;

    // In production, upload to cloud storage here
    // For now, we'll simulate the upload process

    // Update user avatar
    await prisma.user.update({
      where: { id: decoded.id },
      data: {
        avatar: avatarUrl,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Avatar updated successfully',
      data: {
        avatarUrl: avatarUrl,
        fileInfo: {
          size: optimizedImage.length,
          type: 'image/jpeg',
          dimensions: '400x400'
        }
      }
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
