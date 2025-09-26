import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireArtist } from "@/lib/api";

// period format: YYYY-MM (e.g., 2025-08)
export async function GET(_req: Request, ctx: { params: { period: string } }) {
  try {
    const artist = await requireArtist();
    const period = ctx.params.period;
    
    if (!/^\d{4}-\d{2}$/.test(period)) {
      return new NextResponse("Invalid period format. Use YYYY-MM", { status: 400 });
    }
    
    const [year, month] = period.split("-").map(Number);
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    // Find tracks where this artist is a payee via splits
    const splits = await prisma.split.findMany({
      where: { artistId: artist.id },
      select: { trackId: true, percent: true },
    });
    
    const byTrack = new Map<string, number>();
    for (const s of splits) {
      byTrack.set(s.trackId, (byTrack.get(s.trackId) || 0) + Number(s.percent));
    }

    const trackIds = Array.from(byTrack.keys());
    if (trackIds.length === 0) {
      const headers = headersFor(period, artist.name || "artist");
      return new NextResponse("date,store,track,isrc,currency,amount,share_percent,share_amount_usd\n", { headers });
    }

    const earnings = await prisma.earning.findMany({
      where: { trackId: { in: trackIds }, period: period },
      select: { period: true, trackId: true, store: true, revenue: true },
      orderBy: { period: "asc" },
    });

    const rows: string[] = [];
    rows.push("date,store,track,isrc,currency,amount,share_percent,share_amount_usd");

    // preload tracks
    const tracks = await prisma.track.findMany({ 
      where: { id: { in: trackIds } }, 
      select: { id: true, title: true, isrc: true } 
    });
    const tmap = new Map(tracks.map(t => [t.id, t]));

    for (const e of earnings) {
      const pct = (byTrack.get(e.trackId) || 0);
      const track = tmap.get(e.trackId);
      const shareUSD = Number(e.revenue) * (pct / 100); // assuming revenue is in USD
      rows.push([
        e.period,
        escapeCsv(e.store || "Kushtunes"),
        escapeCsv(track?.title || ""),
        escapeCsv(track?.isrc || ""),
        "USD", // currency
        Number(e.revenue).toFixed(2),
        pct.toFixed(2),
        shareUSD.toFixed(2),
      ].join(","));
    }

    const headers = headersFor(period, artist.name || "artist");
    return new NextResponse(rows.join("\n") + "\n", { headers });
  } catch (error) {
    console.error("CSV generation error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

function headersFor(period: string, who: string) {
  return new Headers({
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="statement-${period}-${sanitize(who)}.csv"`
  });
}

function sanitize(s: string) { 
  return s.replace(/[^a-z0-9-_]+/gi, "_").toLowerCase(); 
}

function escapeCsv(s: string) {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}