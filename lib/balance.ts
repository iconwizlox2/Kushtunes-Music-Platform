import { prisma } from "@/lib/db";
import { toUSD } from "@/lib/fx";

/**
 * Computes:
 *  - earnedUSD: sum of artist shares from earnings (by splits) in USD
 *  - paidOrPendingUSD: sum of payouts (pending + paid)
 *  - availableUSD: max(0, earnedUSD - paidOrPendingUSD)
 *
 * Notes:
 *  - Earning.revenue is assumed "gross for this track+store+period in its currency".
 *  - Split.percent applies to revenue for that track.
 *  - If Split.recoup is true, you can subtract recoupable advance costs before sharing (TODO hook).
 */
export async function getArtistBalanceUSD(artistId: string) {
  // 1) Fetch splits for this artist (their share on specific tracks)
  const splits = await prisma.split.findMany({
    where: { artistId },
    select: { trackId: true, percent: true, recoupmentFlag: true },
  });
  if (splits.length === 0) {
    const paidOrPendingUSD = await sumPayoutsUSD(artistId);
    return { earnedUSD: 0, paidOrPendingUSD, availableUSD: 0 };
  }

  const byTrack = new Map<string, { percent: number; recoup: boolean }[]>();
  for (const s of splits) {
    const arr = byTrack.get(s.trackId) ?? [];
    arr.push({ percent: Number(s.percent), recoup: s.recoupmentFlag });
    byTrack.set(s.trackId, arr);
  }
  const trackIds = Array.from(byTrack.keys());

  // 2) Pull earnings for those tracks
  const earnings = await prisma.earning.findMany({
    where: { trackId: { in: trackIds } },
    select: { trackId: true, revenue: true },
  });

  // 3) Apply split %, sum in USD
  let earnedUSD = 0;
  for (const e of earnings) {
    const shareDefs = byTrack.get(e.trackId!);
    if (!shareDefs || !e.revenue) continue;

    // If an artist has multiple Split rows on the same track, we sum them.
    const totalPercentForArtist = shareDefs.reduce((acc, s) => acc + Number(s.percent), 0);
    const revUSD = toUSD(Number(e.revenue)); // Assuming USD in schema
    earnedUSD += revUSD * (totalPercentForArtist / 100);
  }

  // 4) TODO: recoup logic (optional)
  // If you have an Advances/Costs table, subtract remaining recoupable balances here
  // before computing availableUSD.

  // 5) Subtract payouts (pending + paid)
  const paidOrPendingUSD = await sumPayoutsUSD(artistId);

  const availableUSD = Math.max(0, earnedUSD - paidOrPendingUSD);
  return { earnedUSD, paidOrPendingUSD, availableUSD };
}

async function sumPayoutsUSD(artistId: string) {
  const payouts = await prisma.payout.findMany({
    where: { artistId, status: { in: ["PENDING", "APPROVED", "PROCESSED"] } },
    select: { amount: true }, // amounts are assumed USD in your schema
  });
  return payouts.reduce((acc, p) => acc + Number(p.amount), 0);
}
