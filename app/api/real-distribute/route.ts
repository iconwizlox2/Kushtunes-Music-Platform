import { NextRequest, NextResponse } from 'next/server';
import { REAL_DISTRIBUTORS, DistributorAPI } from '@/lib/real-distributors';

export async function POST(request: NextRequest) {
  try {
    const { distributor, apiKey, releaseData } = await request.json();

    if (!distributor || !apiKey || !releaseData) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate distributor
    if (!REAL_DISTRIBUTORS[distributor]) {
      return NextResponse.json(
        { success: false, message: 'Invalid distributor' },
        { status: 400 }
      );
    }

    // Initialize distributor API
    const distributorAPI = new DistributorAPI(distributor, apiKey);

    // Upload release
    const result = await distributorAPI.uploadRelease(releaseData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Release uploaded successfully',
        data: {
          distributor: REAL_DISTRIBUTORS[distributor].name,
          submissionId: result.submissionId,
          platforms: REAL_DISTRIBUTORS[distributor].platforms,
          cost: REAL_DISTRIBUTORS[distributor].cost,
          revenueShare: REAL_DISTRIBUTORS[distributor].revenueShare
        }
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.error || 'Upload failed' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Real distributor upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distributor = searchParams.get('distributor');
    const submissionId = searchParams.get('submissionId');
    const apiKey = searchParams.get('apiKey');

    if (!distributor || !submissionId || !apiKey) {
      return NextResponse.json(
        { success: false, message: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const distributorAPI = new DistributorAPI(distributor, apiKey);
    const status = await distributorAPI.checkStatus(submissionId);

    return NextResponse.json({
      success: true,
      data: {
        status: status.status,
        platformUrls: status.platformUrls
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
