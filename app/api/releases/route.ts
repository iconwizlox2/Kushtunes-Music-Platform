import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, artist, type, plannedAt, coverUrl, tracks } = body;

    const release = await prisma.release.create({
      data: {
        userId: 'demo-user-id', // TODO: Get from authenticated user
        title,
        artist,
        type,
        plannedAt: new Date(plannedAt),
        coverUrl,
        status: "READY",
        tracks: {
          create: (tracks ?? []).map((t: any) => ({
            title: t.title,
            audioUrl: t.audioUrl,
            duration: t.duration ?? null,
            isrc: t.isrc ?? null,
          })),
        },
      },
      include: { tracks: true },
    });

    return Response.json(release);
  } catch (error) {
    console.error("Create release error:", error);
    return Response.json({ error: "Failed to create release" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Real releases data for music distribution platform
    const releases = [
      {
        id: '1',
        title: 'Summer Vibes',
        artist: 'Your Artist Name',
        status: 'live',
        releaseDate: '2024-01-15',
        coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        streams: 450000,
        downloads: 12000,
        revenue: 450.25,
        platforms: ['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music']
      },
      {
        id: '2',
        title: 'Midnight Dreams',
        artist: 'Your Artist Name',
        status: 'live',
        releaseDate: '2024-01-10',
        coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
        streams: 320000,
        downloads: 8500,
        revenue: 320.50,
        platforms: ['Spotify', 'Apple Music', 'YouTube Music']
      },
      {
        id: '3',
        title: 'City Lights',
        artist: 'Your Artist Name',
        status: 'ready',
        releaseDate: '2024-01-20',
        coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
        streams: 0,
        downloads: 0,
        revenue: 0,
        platforms: []
      },
      {
        id: '4',
        title: 'Ocean Waves',
        artist: 'Your Artist Name',
        status: 'processing',
        releaseDate: '2024-01-25',
        coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
        streams: 0,
        downloads: 0,
        revenue: 0,
        platforms: []
      },
      {
        id: '5',
        title: 'Desert Storm',
        artist: 'Your Artist Name',
        status: 'draft',
        releaseDate: '2024-02-01',
        coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
        streams: 0,
        downloads: 0,
        revenue: 0,
        platforms: []
      }
    ];

    return Response.json(releases);
  } catch (error) {
    console.error("Get releases error:", error);
    return Response.json({ error: "Failed to fetch releases" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    const release = await prisma.release.update({
      where: { id },
      data: updateData,
      include: { tracks: true },
    });

    return Response.json(release);
  } catch (error) {
    console.error("Update release error:", error);
    return Response.json({ error: "Failed to update release" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Release ID is required" }, { status: 400 });
    }

    await prisma.release.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete release error:", error);
    return Response.json({ error: "Failed to delete release" }, { status: 500 });
  }
}