import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artistId = params.id;
    
    // Mock releases data - in production, this would come from your database
    const mockReleases = [
      {
        id: "1",
        title: "Midnight Dreams",
        type: "ALBUM",
        coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        releaseDate: "2024-01-15",
        streams: 125000,
        tracks: [
          { id: "1", title: "Midnight Dreams", duration: 240, streams: 45000 },
          { id: "2", title: "City Lights", duration: 195, streams: 32000 },
          { id: "3", title: "Ocean Waves", duration: 210, streams: 28000 },
          { id: "4", title: "Sunset Boulevard", duration: 225, streams: 20000 }
        ]
      },
      {
        id: "2",
        title: "Electric Soul",
        type: "SINGLE",
        coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop",
        releaseDate: "2023-11-20",
        streams: 89000,
        tracks: [
          { id: "5", title: "Electric Soul", duration: 195, streams: 89000 }
        ]
      },
      {
        id: "3",
        title: "Neon Nights EP",
        type: "EP",
        coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
        releaseDate: "2023-08-10",
        streams: 156000,
        tracks: [
          { id: "6", title: "Neon Nights", duration: 220, streams: 55000 },
          { id: "7", title: "Digital Love", duration: 195, streams: 48000 },
          { id: "8", title: "Future Memories", duration: 210, streams: 53000 }
        ]
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockReleases
    });

  } catch (error) {
    console.error('Artist releases API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch artist releases' },
      { status: 500 }
    );
  }
}
