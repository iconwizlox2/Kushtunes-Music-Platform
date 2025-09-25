import { NextRequest, NextResponse } from 'next/server';

interface Event {
  id: string;
  title: string;
  artist: string;
  date: string;
  location: string;
  type: 'CONCERT' | 'LIVESTREAM' | 'MEET_AND_GREET';
  attendees: number;
  maxAttendees?: number;
  price: number;
  coverUrl: string;
}

export async function GET(request: NextRequest) {
  try {
    // Mock events data - in production, this would come from your database
    const mockEvents: Event[] = [
      {
        id: "1",
        title: "Midnight Dreams Album Release Party",
        artist: "Alex Johnson",
        date: "2024-02-15T20:00:00Z",
        location: "The Roxy Theatre, Los Angeles",
        type: "CONCERT",
        attendees: 450,
        maxAttendees: 500,
        price: 35,
        coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"
      },
      {
        id: "2",
        title: "Virtual Studio Session",
        artist: "Maria Santos",
        date: "2024-02-20T19:00:00Z",
        location: "Online Event",
        type: "LIVESTREAM",
        attendees: 1200,
        price: 0,
        coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop"
      },
      {
        id: "3",
        title: "Meet & Greet with David Chen",
        artist: "David Chen",
        date: "2024-02-25T15:00:00Z",
        location: "Record Store Day, Atlanta",
        type: "MEET_AND_GREET",
        attendees: 85,
        maxAttendees: 100,
        price: 0,
        coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=300&fit=crop"
      },
      {
        id: "4",
        title: "Acoustic Night at The Blue Note",
        artist: "Emma Wilson",
        date: "2024-03-01T21:00:00Z",
        location: "The Blue Note, Seattle",
        type: "CONCERT",
        attendees: 200,
        maxAttendees: 250,
        price: 25,
        coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop"
      },
      {
        id: "5",
        title: "Songwriting Workshop",
        artist: "James Rodriguez",
        date: "2024-03-05T14:00:00Z",
        location: "Nashville Songwriters Association",
        type: "MEET_AND_GREET",
        attendees: 30,
        maxAttendees: 40,
        price: 50,
        coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop"
      },
      {
        id: "6",
        title: "R&B Night Live Stream",
        artist: "Sophie Kim",
        date: "2024-03-10T20:30:00Z",
        location: "Online Event",
        type: "LIVESTREAM",
        attendees: 800,
        price: 0,
        coverUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockEvents
    });

  } catch (error) {
    console.error('Community events API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
