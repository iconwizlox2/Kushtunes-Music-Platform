import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// POST /api/admin/releases/:id/review - Approve/reject release
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

    // Check if user is admin
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;
    const { approved, notes } = await request.json();

    // Update release status
    const release = await prisma.release.update({
      where: { id },
      data: {
        status: approved ? 'APPROVED' : 'REJECTED',
        updatedAt: new Date()
      }
    });

    // If approved, create delivery records for all stores
    if (approved) {
      const stores = ['Spotify', 'Apple Music', 'Amazon Music', 'YouTube Music', 'Tidal', 'Deezer'];
      
      await Promise.all(
        stores.map(store =>
          prisma.delivery.create({
            data: {
              releaseId: id,
              store,
              status: 'SUBMITTED',
              submittedAt: new Date(),
              notes: notes || 'Approved by admin'
            }
          })
        )
      );
    }

    return NextResponse.json({
      success: true,
      message: `Release ${approved ? 'approved' : 'rejected'} successfully`,
      data: {
        id: release.id,
        status: release.status
      }
    });

  } catch (error) {
    console.error('Review release error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
