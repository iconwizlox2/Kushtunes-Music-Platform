import { json, onError, requireArtist, BadRequestError } from "@/lib/api";
import { getArtistBalanceUSD, getOpenRecoupUSD } from "@/lib/balance";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const artist = await requireArtist();
    const url = new URL(req.url);
    const startStr = url.searchParams.get("start");
    const endStr = url.searchParams.get("end");
    let start: Date | undefined, end: Date | undefined;

    if (startStr) {
      const d = new Date(startStr);
      if (Number.isNaN(d.getTime())) throw new BadRequestError("Invalid start date");
      start = d;
    }
    if (endStr) {
      const d = new Date(endStr);
      if (Number.isNaN(d.getTime())) throw new BadRequestError("Invalid end date");
      end = d;
    }

    const bal = await getArtistBalanceUSD(artist.id, { start, end });
    const openRecoupUSD = await getOpenRecoupUSD(artist.id);

    return json({
      ok: true,
      ...bal,
      openRecoupUSD,
      window: { start: start?.toISOString() ?? null, end: end?.toISOString() ?? null }
    });
  } catch (e) {
    return onError(e);
  }
}
