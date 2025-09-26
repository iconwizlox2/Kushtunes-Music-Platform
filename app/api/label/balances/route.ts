import { json, onError, requireLabelOwner, BadRequestError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { getArtistBalanceUSD } from "@/lib/balance";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { label } = await requireLabelOwner();
    const url = new URL(req.url);
    const startStr = url.searchParams.get("start");
    const endStr = url.searchParams.get("end");
    let start: Date | undefined, end: Date | undefined;
    if (startStr) {
      const d = new Date(startStr);
      if (Number.isNaN(d.getTime())) throw new BadRequestError("Invalid start");
      start = d;
    }
    if (endStr) {
      const d = new Date(endStr);
      if (Number.isNaN(d.getTime())) throw new BadRequestError("Invalid end");
      end = d;
    }

    const members = await prisma.labelMember.findMany({
      where: { labelId: label.id, role: "artist" },
      include: { artist: { select: { id: true, name: true, email: true } } }
    });

    const rows = await Promise.all(
      members.map(async (m) => {
        const bal = await getArtistBalanceUSD(m.artist.id, { start, end });
        return { artistId: m.artist.id, name: m.artist.name, email: m.artist.email, ...bal };
      })
    );

    const totals = rows.reduce(
      (acc, r) => {
        acc.earnedUSD += r.earnedUSD;
        acc.recoupAppliedUSD += r.recoupAppliedUSD;
        acc.paidOrPendingUSD += r.paidOrPendingUSD;
        acc.availableUSD += r.availableUSD;
        return acc;
      },
      { earnedUSD: 0, recoupAppliedUSD: 0, paidOrPendingUSD: 0, availableUSD: 0 }
    );

    return json({ ok: true, label, rows, totals, window: { start: start?.toISOString() ?? null, end: end?.toISOString() ?? null } });
  } catch (e) {
    return onError(e);
  }
}
