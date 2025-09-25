import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Test API route working',
    timestamp: new Date().toISOString()
  });
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
