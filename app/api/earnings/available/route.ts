import { json, onError, requireArtist } from "@/lib/api";
import { getArtistBalanceUSD } from "@/lib/balance";

export async function GET() {
  try {
    const artist = await requireArtist();
    const bal = await getArtistBalanceUSD(artist.id);
    return json({ ok: true, ...bal });
  } catch (e) {
    return onError(e);
  }
}
