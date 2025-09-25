import { prisma } from "@/lib/db";
import { toUSD } from "@/lib/fx";

/**
 * Period window:
 *  - If both start/end provided, include earnings with period in [start, end] (inclusive).
 *  - If only end provided, include earnings with period <= end.
 *  - If only start provided, include earnings with period >= start.
 *  - If neither: lifetime.
 *
 * Recoup logic:
 *  - If a Split on a track has recoup=true, that artist's share for that track can be reduced
 *    by open advances and/or open recoupable costs. (Artist-level, not per-track bucket here.)
 *  - We subtract the smaller of (earnedFromRecoupableTracksUSD, openRecoupUSD).
 *
 * Payout offset:
 *  - Subtract sum of payouts with status in ["pending", "paid"] (already requested or paid).
 */
export async function getArtistBalanceUSD(
  artistId: string,
  opts?: { start?: Date; end?: Date }
) {
  const { start, end } = normalizeWindow(opts);

  // 1) Splits for artist
  const splits = await prisma.split.findMany({
    where: { artistId },
    select: { trackId: true, percent: true, recoupmentFlag: true },
  });
  if (splits.length === 0) {
    const paidOrPendingUSD = await sumPayoutsUSD(artistId, start, end);
    return { earnedUSD: 0, paidOrPendingUSD, recoupAppliedUSD: 0, availableUSD: 0 };
  }

  const byTrack = new Map<string, { percent: number; recoup: boolean }[]>();
  for (const s of splits) {
    const arr = byTrack.get(s.trackId) ?? [];
    arr.push({ percent: Number(s.percent), recoup: s.recoupmentFlag });
    byTrack.set(s.trackId, arr);
  }
  const trackIds = Array.from(byTrack.keys());

  // 2) Earnings inside window
  const earnings = await prisma.earning.findMany({
    where: {
      trackId: { in: trackIds },
      ...(start || end
        ? {
            // Interpret Earning.period as a date string or Date; adjust to your schema
            period: {
              ...(start ? { gte: start } : {}),
              ...(end ? { lte: end } : {}),
            },
          }
        : {}),
    },
    select: { trackId: true, revenue: true },
  });

  // 3) Sum artist share in USD; track "recoupable track" share separately
  let earnedUSD = 0;
  let earnedFromRecoupableTracksUSD = 0;

  for (const e of earnings) {
    const defs = byTrack.get(e.trackId!);
    if (!defs || !e.revenue) continue;

    const totalPercent = defs.reduce((acc, s) => acc + Number(s.percent), 0);
    const revUSD = toUSD(Number(e.revenue)); // Assuming USD in schema
    const artistShareUSD = revUSD * (totalPercent / 100);
    earnedUSD += artistShareUSD;

    // If ANY split for this artist on this track is marked recoup,
    // consider this share as recoupable for the artist
    if (defs.some((s) => s.recoup)) {
      earnedFromRecoupableTracksUSD += artistShareUSD;
    }
  }

  // 4) Recoup offsets (open advances + open recoupable costs)
  const openRecoupUSD = await sumOpenRecoupUSD(artistId);
  const recoupAppliedUSD = Math.min(earnedFromRecoupableTracksUSD, openRecoupUSD);

  // 5) Payouts offset (pending + paid) in window (usually lifetime, but window-aware if you like)
  const paidOrPendingUSD = await sumPayoutsUSD(artistId, undefined, end); // payouts typically not window-limited; cap up to 'end' if provided

  // 6) Available
  const availableUSD = Math.max(0, (earnedUSD - recoupAppliedUSD) - paidOrPendingUSD);

  return { earnedUSD, recoupAppliedUSD, paidOrPendingUSD, availableUSD };
}

function normalizeWindow(opts?: { start?: Date; end?: Date }) {
  let start = opts?.start ? new Date(opts.start) : undefined;
  let end = opts?.end ? new Date(opts.end) : undefined;
  // Ensure valid order if both provided
  if (start && end && start > end) [start, end] = [end, start];
  return { start, end };
}

async function sumPayoutsUSD(artistId: string, _start?: Date, end?: Date) {
  const payouts = await prisma.payout.findMany({
    where: {
      artistId,
      status: { in: ["PENDING", "APPROVED", "PROCESSED"] },
      ...(end ? { createdAt: { lte: end } } : {}),
    },
    select: { amount: true },
  });
  return payouts.reduce((acc, p) => acc + Number(p.amount), 0);
}

/**
 * Sum of open recoup balances (advances + recoupable costs).
 * Schema assumptions (adjust names to your schema):
 *  - Advance: { artistId, remainingUSD, status: "open" | "closed" }
 *  - Cost: { artistId, remainingUSD, status: "open" | "closed", recoupable: boolean }
 * If you only have Advances, keep just that part.
 */
async function sumOpenRecoupUSD(artistId: string) {
  let total = 0;

  // Advances
  try {
    const adv = await prisma.advance.aggregate({
      _sum: { remainingUSD: true },
      where: { artistId, status: "open" },
    });
    total += Number(adv._sum.remainingUSD || 0);
  } catch {
    // Table may not exist yet — ignore
  }

  // Recoupable costs (optional)
  try {
    const costs = await prisma.cost.aggregate({
      _sum: { remainingUSD: true },
      where: { artistId, status: "open", recoupable: true },
    });
    total += Number(costs._sum.remainingUSD || 0);
  } catch {
    // Table may not exist — ignore
  }

  return total;
}
