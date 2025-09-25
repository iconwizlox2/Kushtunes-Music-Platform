import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// POST /api/admin/payouts/:id/approve - Approve/reject payout
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

    // Update payout status
    const payout = await prisma.payout.update({
      where: { id },
      data: {
        status: approved ? 'APPROVED' : 'FAILED',
        processedAt: approved ? new Date() : null
      }
    });

    // If approved, process the payout (in a real system, this would integrate with Stripe/PayPal)
    if (approved) {
      // Simulate payout processing
      console.log(`Processing payout ${payout.id} for ${payout.amount} via ${payout.method}`);
      
      // Update status to PROCESSED after successful processing
      await prisma.payout.update({
        where: { id },
        data: {
          status: 'PROCESSED',
          processedAt: new Date()
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Payout ${approved ? 'approved and processed' : 'failed'} successfully`,
      data: {
        id: payout.id,
        status: approved ? 'PROCESSED' : 'FAILED'
      }
    });

  } catch (error) {
    console.error('Approve payout error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
