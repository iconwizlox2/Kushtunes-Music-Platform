import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/artist/profile - Get artist profile
export async function GET(request: NextRequest) {
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

    return NextResponse.json({
      success: true,
      data: {
        id: artist.id,
        name: artist.name,
        legalName: artist.legalName,
        country: artist.country,
        email: artist.email,
        payoutMethod: artist.payoutMethod,
        kycStatus: artist.kycStatus,
        kycDocuments: artist.kycDocuments,
        createdAt: artist.createdAt,
        updatedAt: artist.updatedAt
      }
    });

  } catch (error) {
    console.error('Get artist profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/artist/profile - Update artist profile
export async function PUT(request: NextRequest) {
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

    // Update artist profile
    const updatedArtist = await prisma.artist.update({
      where: { id: artist.id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedArtist.id,
        name: updatedArtist.name,
        legalName: updatedArtist.legalName,
        country: updatedArtist.country,
        email: updatedArtist.email,
        payoutMethod: updatedArtist.payoutMethod,
        kycStatus: updatedArtist.kycStatus,
        kycDocuments: updatedArtist.kycDocuments,
        updatedAt: updatedArtist.updatedAt
      }
    });

  } catch (error) {
    console.error('Update artist profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
