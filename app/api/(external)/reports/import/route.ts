import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// POST /api/reports/import - Import royalty reports
export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const period = formData.get('period') as string; // YYYY-MM format
    const source = formData.get('source') as string; // Distributor name

    if (!file || !period || !source) {
      return NextResponse.json(
        { success: false, message: 'File, period, and source are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Only CSV and Excel files are allowed' },
        { status: 400 }
      );
    }

    // Parse file content
    const fileContent = await file.text();
    const parsedData = await parseReportFile(fileContent, file.type);

    // Create report record
    const report = await prisma.report.create({
      data: {
        period,
        source,
        fileUrl: `https://storage.example.com/reports/${period}-${source}.${file.name.split('.').pop()}`,
        importedFlag: false
      }
    });

    // Process and store earnings data
    const earnings = await processEarningsData(parsedData, report.id);

    // Update report as imported
    await prisma.report.update({
      where: { id: report.id },
      data: { 
        importedFlag: true,
        importedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Report imported successfully',
      data: {
        reportId: report.id,
        period,
        source,
        earningsCount: earnings.length,
        totalRevenue: earnings.reduce((sum, e) => sum + e.revenue, 0)
      }
    });

  } catch (error) {
    console.error('Import report error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
async function parseReportFile(content: string, fileType: string): Promise<any[]> {
  // This would parse CSV/Excel files and return structured data
  // For now, return mock data structure
  
  if (fileType === 'text/csv') {
    // Parse CSV
    const lines = content.split('\n');
    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      const row: any = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim();
      });
      return row;
    });
    return data;
  } else {
    // Parse Excel (would need xlsx library)
    // For now, return mock data
    return [
      {
        isrc: 'USRC17607839',
        store: 'Spotify',
        country: 'US',
        units: 1000,
        revenue: 3.50
      }
    ];
  }
}

async function processEarningsData(data: any[], reportId: string): Promise<any[]> {
  const earnings = [];

  for (const row of data) {
    // Find track by ISRC
    const track = await prisma.track.findUnique({
      where: { isrc: row.isrc }
    });

    if (track) {
      const earning = await prisma.earning.create({
        data: {
          trackId: track.id,
          store: row.store,
          country: row.country,
          units: parseInt(row.units) || 0,
          revenue: parseFloat(row.revenue) || 0,
          period: row.period,
          reportId
        }
      });
      earnings.push(earning);
    }
  }

  return earnings;
}
