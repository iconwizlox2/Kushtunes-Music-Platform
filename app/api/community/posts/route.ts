import { NextRequest, NextResponse } from 'next/server';

interface Post {
  id: string;
  artistId: string;
  artistName: string;
  artistAvatar: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'MUSIC';
  mediaUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  isLiked: boolean;
}

export async function GET(request: NextRequest) {
  try {
    // Mock posts data - in production, this would come from your database
    const mockPosts: Post[] = [
      {
        id: "1",
        artistId: "1",
        artistName: "Alex Johnson",
        artistAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        content: "Just finished recording my new single! Can't wait to share it with you all. The energy in the studio was incredible today. 🎵✨",
        type: "TEXT",
        likes: 45,
        comments: 12,
        shares: 8,
        createdAt: "2024-01-15T10:30:00Z",
        isLiked: false
      },
      {
        id: "2",
        artistId: "2",
        artistName: "Maria Santos",
        artistAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        content: "Behind the scenes of my latest music video shoot! The team did an amazing job bringing my vision to life.",
        type: "IMAGE",
        mediaUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
        likes: 78,
        comments: 23,
        shares: 15,
        createdAt: "2024-01-14T15:45:00Z",
        isLiked: true
      },
      {
        id: "3",
        artistId: "3",
        artistName: "David Chen",
        artistAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        content: "New track dropping next week! Here's a preview of what's coming. What do you think?",
        type: "MUSIC",
        mediaUrl: "https://example.com/preview.mp3",
        likes: 92,
        comments: 31,
        shares: 22,
        createdAt: "2024-01-13T20:15:00Z",
        isLiked: false
      },
      {
        id: "4",
        artistId: "4",
        artistName: "Emma Wilson",
        artistAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        content: "Thank you to everyone who came out to the show last night! The energy was electric. Can't wait for the next one! 🎸",
        type: "TEXT",
        likes: 156,
        comments: 45,
        shares: 28,
        createdAt: "2024-01-12T22:30:00Z",
        isLiked: true
      },
      {
        id: "5",
        artistId: "5",
        artistName: "James Rodriguez",
        artistAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        content: "Working on some new material in the studio today. Sometimes the best songs come from the most unexpected moments.",
        type: "TEXT",
        likes: 34,
        comments: 8,
        shares: 5,
        createdAt: "2024-01-11T14:20:00Z",
        isLiked: false
      },
      {
        id: "6",
        artistId: "6",
        artistName: "Sophie Kim",
        artistAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
        content: "Check out this acoustic version of my latest single. Sometimes stripping it down reveals the heart of the song.",
        type: "VIDEO",
        mediaUrl: "https://example.com/acoustic-video.mp4",
        likes: 203,
        comments: 67,
        shares: 41,
        createdAt: "2024-01-10T18:45:00Z",
        isLiked: true
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockPosts
    });

  } catch (error) {
    console.error('Community posts API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
