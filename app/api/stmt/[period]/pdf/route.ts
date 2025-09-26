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
    
    // Generate a simple PDF-like text response for now
    // In production, you'd use a library like pdfkit
    let pdfContent = `KUSHTUNES STATEMENT\n`;
    pdfContent += `Period: ${period}\n`;
    pdfContent += `Artist: ${artist.name || "Unknown"}\n`;
    pdfContent += `Generated: ${new Date().toISOString().split('T')[0]}\n\n`;
    
    if (trackIds.length === 0) {
      pdfContent += `No earnings found for this period.\n`;
    } else {
      const earnings = await prisma.earning.findMany({
        where: { trackId: { in: trackIds }, period: period },
        select: { period: true, trackId: true, store: true, revenue: true },
        orderBy: { period: "asc" },
      });

      const tracks = await prisma.track.findMany({ 
        where: { id: { in: trackIds } }, 
        select: { id: true, title: true, isrc: true } 
      });
      const tmap = new Map(tracks.map(t => [t.id, t]));

      pdfContent += `EARNINGS BREAKDOWN:\n`;
      pdfContent += `Date\t\tTrack\t\t\tISRC\t\t\tCurrency\tAmount\t\tShare%\t\tShare USD\n`;
      pdfContent += `-`.repeat(100) + `\n`;

      let totalUSD = 0;
      for (const e of earnings) {
        const pct = (byTrack.get(e.trackId) || 0);
        const track = tmap.get(e.trackId);
        const shareUSD = Number(e.revenue) * (pct / 100);
        totalUSD += shareUSD;
        
        pdfContent += `${e.period}\t${(track?.title || "").substring(0, 20)}\t\t${track?.isrc || ""}\t\t${e.store || "Kushtunes"}\t\t${Number(e.revenue).toFixed(2)}\t\t${pct.toFixed(1)}%\t\t$${shareUSD.toFixed(2)}\n`;
      }
      
      pdfContent += `-`.repeat(100) + `\n`;
      pdfContent += `TOTAL EARNINGS: $${totalUSD.toFixed(2)} USD\n`;
      pdfContent += `\nCommission: 10%\n`;
      pdfContent += `Net to Artist: $${(totalUSD * 0.9).toFixed(2)} USD\n`;
    }

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="statement-${period}-${sanitize(artist.name || "artist")}.pdf"`
    });

    return new NextResponse(pdfContent, { headers });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

function sanitize(s: string) { 
  return s.replace(/[^a-z0-9-_]+/gi, "_").toLowerCase(); 
}