import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artistId = params.id;
    
    // Mock artist data - in production, this would come from your database
    const mockArtist = {
      id: artistId,
      name: "Alex Johnson",
      bio: "Independent artist from Los Angeles creating soulful electronic music that blends traditional instruments with modern production techniques. With over 5 years of experience in the music industry, Alex has performed at major festivals and collaborated with renowned producers.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop",
      location: "Los Angeles, CA",
      genre: "Electronic Soul",
      followers: 12500,
      monthlyListeners: 45000,
      socialLinks: {
        instagram: "https://instagram.com/alexjohnsonmusic",
        twitter: "https://twitter.com/alexjohnsonmusic",
        youtube: "https://youtube.com/alexjohnsonmusic",
        tiktok: "https://tiktok.com/@alexjohnsonmusic"
      },
      verified: true,
      joinedDate: "2022-03-15"
    };

    return NextResponse.json({
      success: true,
      data: mockArtist
    });

  } catch (error) {
    console.error('Artist profile API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch artist profile' },
      { status: 500 }
    );
  }
}
