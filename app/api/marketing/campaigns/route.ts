import { NextRequest, NextResponse } from 'next/server';

interface Campaign {
  id: string;
  name: string;
  releaseId: string;
  releaseTitle: string;
  coverUrl: string;
  type: 'PRESAVE' | 'HYPERFOLLOW';
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  createdAt: string;
  startDate: string;
  endDate: string;
  stats: {
    clicks: number;
    conversions: number;
    conversionRate: number;
    platforms: { [key: string]: number };
  };
  links: {
    presaveUrl: string;
    hyperfollowUrl: string;
    qrCode: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    // Mock campaigns data - in production, this would come from your database
    const mockCampaigns: Campaign[] = [
      {
        id: "1",
        name: "Midnight Dreams Launch",
        releaseId: "1",
        releaseTitle: "Midnight Dreams",
        coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        type: "PRESAVE",
        status: "ACTIVE",
        createdAt: "2024-01-01",
        startDate: "2024-01-01",
        endDate: "2024-01-15",
        stats: {
          clicks: 1250,
          conversions: 890,
          conversionRate: 71.2,
          platforms: {
            spotify: 650,
            apple: 180,
            amazon: 60
          }
        },
        links: {
          presaveUrl: "https://kushtunes.com/presave/midnight-dreams",
          hyperfollowUrl: "https://kushtunes.com/hyperfollow/midnight-dreams",
          qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://kushtunes.com/presave/midnight-dreams"
        }
      },
      {
        id: "2",
        name: "Electric Soul Promotion",
        releaseId: "2",
        releaseTitle: "Electric Soul",
        coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop",
        type: "HYPERFOLLOW",
        status: "COMPLETED",
        createdAt: "2023-11-15",
        startDate: "2023-11-15",
        endDate: "2023-11-30",
        stats: {
          clicks: 2100,
          conversions: 1450,
          conversionRate: 69.0,
          platforms: {
            spotify: 980,
            apple: 320,
            amazon: 150
          }
        },
        links: {
          presaveUrl: "https://kushtunes.com/presave/electric-soul",
          hyperfollowUrl: "https://kushtunes.com/hyperfollow/electric-soul",
          qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://kushtunes.com/hyperfollow/electric-soul"
        }
      },
      {
        id: "3",
        name: "Neon Nights EP Campaign",
        releaseId: "3",
        releaseTitle: "Neon Nights EP",
        coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
        type: "PRESAVE",
        status: "DRAFT",
        createdAt: "2023-08-01",
        startDate: "2023-08-01",
        endDate: "2023-08-15",
        stats: {
          clicks: 0,
          conversions: 0,
          conversionRate: 0,
          platforms: {}
        },
        links: {
          presaveUrl: "https://kushtunes.com/presave/neon-nights",
          hyperfollowUrl: "https://kushtunes.com/hyperfollow/neon-nights",
          qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://kushtunes.com/presave/neon-nights"
        }
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockCampaigns
    });

  } catch (error) {
    console.error('Marketing campaigns API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch marketing campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In production, this would create a new campaign in your database
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: body.name,
      releaseId: body.releaseId,
      releaseTitle: body.releaseTitle,
      coverUrl: body.coverUrl,
      type: body.type,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      startDate: body.startDate,
      endDate: body.endDate,
      stats: {
        clicks: 0,
        conversions: 0,
        conversionRate: 0,
        platforms: {}
      },
      links: {
        presaveUrl: `https://kushtunes.com/presave/${body.releaseId}`,
        hyperfollowUrl: `https://kushtunes.com/hyperfollow/${body.releaseId}`,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://kushtunes.com/presave/${body.releaseId}`
      }
    };

    return NextResponse.json({
      success: true,
      data: newCampaign
    });

  } catch (error) {
    console.error('Create campaign API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
