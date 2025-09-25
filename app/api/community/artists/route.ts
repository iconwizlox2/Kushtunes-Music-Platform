import { NextRequest, NextResponse } from 'next/server';

interface Artist {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  followers: number;
  genre: string;
  location: string;
  latestRelease: string;
  isFollowing: boolean;
}

export async function GET(request: NextRequest) {
  try {
    // Mock artists data - in production, this would come from your database
    const mockArtists: Artist[] = [
      {
        id: "1",
        name: "Alex Johnson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        verified: true,
        followers: 12500,
        genre: "Electronic Soul",
        location: "Los Angeles, CA",
        latestRelease: "Midnight Dreams",
        isFollowing: false
      },
      {
        id: "2",
        name: "Maria Santos",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        verified: true,
        followers: 8900,
        genre: "Indie Pop",
        location: "New York, NY",
        latestRelease: "City Lights",
        isFollowing: true
      },
      {
        id: "3",
        name: "David Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        verified: false,
        followers: 5600,
        genre: "Hip-Hop",
        location: "Atlanta, GA",
        latestRelease: "Street Dreams",
        isFollowing: false
      },
      {
        id: "4",
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        verified: true,
        followers: 15200,
        genre: "Alternative Rock",
        location: "Seattle, WA",
        latestRelease: "Ocean Waves",
        isFollowing: true
      },
      {
        id: "5",
        name: "James Rodriguez",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        verified: false,
        followers: 3200,
        genre: "Folk",
        location: "Nashville, TN",
        latestRelease: "Country Roads",
        isFollowing: false
      },
      {
        id: "6",
        name: "Sophie Kim",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
        verified: true,
        followers: 9800,
        genre: "R&B",
        location: "Chicago, IL",
        latestRelease: "Midnight Love",
        isFollowing: false
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockArtists
    });

  } catch (error) {
    console.error('Community artists API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch artists' },
      { status: 500 }
    );
  }
}
