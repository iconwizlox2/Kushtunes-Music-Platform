import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

type ArtistSpec = {
  session: string;      // becomes artist+<session>@example.com
  name: string;
  role?: "admin"|"user";
  payoutMethod?: "paypal"|"stripe"|"crypto";
  country?: string;
  // release + tracks
  release: {
    title: string;
    upc?: string | null;
    date: string; // ISO
    status: string;
    tracks: Array<{ n: number; title: string; isrc?: string; explicit?: boolean; recoup?: boolean }>;
  };
  // earnings by period & currency
  earnings: Array<{ track: number; period: string; revenue: number; currency: "USD"|"GBP"|"EUR" }>;
  // optional recoup items
  advances?: Array<{ amountUSD: number; remainingUSD: number; status?: "open"|"closed" }>;
  costs?: Array<{ description: string; amountUSD: number; remainingUSD: number; recoupable?: boolean; status?: "open"|"closed" }>;
  payouts?: Array<{ amount: number; method: "paypal"|"stripe"|"crypto"; status: "pending"|"paid"|"rejected"; createdAt: string }>;
};

async function seedArtist(spec: ArtistSpec) {
  const email = `artist+${spec.session}@example.com`;
  
  // Create User first
  const user = await prisma.user.create({
    data: {
      email,
      name: spec.name,
      passwordHash: await bcrypt.hash("password123", 12), // Default password for demo
    },
  });

  // Create Artist linked to User
  const artist = await prisma.artist.create({
    data: {
      userId: user.id,
      name: spec.name,
      legalName: spec.name,
      email,
      country: spec.country ?? "GB",
      payoutMethod: spec.payoutMethod ?? "paypal",
      role: spec.role ?? "user",
    },
  });

  const release = await prisma.release.create({
    data: {
      title: spec.release.title,
      upc: spec.release.upc ?? null,
      primaryArtistId: artist.id,
      releaseDate: new Date(spec.release.date),
      status: spec.release.status.toUpperCase() as any,
      coverUrl: "/cover-sample.jpg",
      territories: ["US", "CA", "GB", "AU", "NZ", "EU"],
    },
  });

  // Tracks + 100% splits to the artist (recoup flag per track)
  const trackRecords = [];
  for (const t of spec.release.tracks) {
    const track = await prisma.track.create({
      data: {
        releaseId: release.id,
        trackNumber: t.n,
        title: t.title,
        isrc: t.isrc ?? null,
        explicit: !!t.explicit,
        duration: 180, // 3 minutes default
        audioUrl: "/audio-sample.mp3",
      },
    });
    trackRecords.push(track);
    await prisma.split.create({
      data: { trackId: track.id, artistId: artist.id, percent: 100, recoupmentFlag: !!t.recoup },
    });
  }

  // Earnings
  await prisma.earning.createMany({
    data: spec.earnings.map(e => ({
      trackId: trackRecords.find(t => t.trackNumber === e.track)!.id,
      period: e.period, // Keep as string (YYYY-MM format)
      revenue: e.revenue,
      store: e.currency === "USD" ? "Apple Music" : e.currency === "GBP" ? "Spotify" : "YouTube",
      country: e.currency === "USD" ? "US" : e.currency === "GBP" ? "GB" : "DE",
    })),
  });

  // Optional recoup
  if (spec.advances?.length) {
    await prisma.advance.createMany({
      data: spec.advances.map(a => ({
        artistId: artist.id,
        amountUSD: a.amountUSD,
        remainingUSD: a.remainingUSD,
        status: a.status ?? "open",
      })),
    });
  }
  if (spec.costs?.length) {
    await prisma.cost.createMany({
      data: spec.costs.map(c => ({
        artistId: artist.id,
        description: c.description,
        amountUSD: c.amountUSD,
        remainingUSD: c.remainingUSD,
        recoupable: c.recoupable ?? true,
        status: c.status ?? "open",
      })),
    });
  }

  // Payouts
  if (spec.payouts?.length) {
    await prisma.payout.createMany({
      data: spec.payouts.map(p => ({
        artistId: artist.id,
        amount: p.amount,
        method: p.method === "paypal" ? "PAYPAL" : p.method === "stripe" ? "STRIPE_CONNECT" : "BANK_TRANSFER",
        status: p.status === "paid" ? "PROCESSED" : "PENDING",
        createdAt: new Date(p.createdAt),
      })),
    });
  }

  // A couple of delivery rows for UI
  try {
    await prisma.delivery.createMany({
      data: [
        { releaseId: release.id, store: "Spotify",     status: "live",     message: "Live" },
        { releaseId: release.id, store: "Apple Music", status: "ingested", message: "Processing" },
        { releaseId: release.id, store: "YouTube",     status: "live",     message: "Live" },
      ],
    });
  } catch {}

  return artist;
}

async function main() {
  // ⚠️ Demo wipe (safe for dev/preview; remove if you have live data)
  await prisma.payout.deleteMany({});
  await prisma.delivery?.deleteMany?.({}).catch(() => {});
  await prisma.earning.deleteMany({});
  await prisma.split.deleteMany({});
  await prisma.track?.deleteMany?.({}).catch(() => {});
  await prisma.release?.deleteMany?.({}).catch(() => {});
  await prisma.cost?.deleteMany?.({}).catch(() => {});
  await prisma.advance?.deleteMany?.({}).catch(() => {});
  await prisma.auditLog?.deleteMany?.({}).catch(() => {});
  await prisma.labelMember?.deleteMany?.({}).catch(() => {});
  await prisma.label?.deleteMany?.({}).catch(() => {});
  await prisma.artist.deleteMany({});
  await prisma.session?.deleteMany?.({}).catch(() => {});
  await prisma.account?.deleteMany?.({}).catch(() => {});
  await prisma.verificationToken?.deleteMany?.({}).catch(() => {});
  await prisma.user.deleteMany({});

  const artists: ArtistSpec[] = [
    // A) dev — admin, mixed currencies, some payouts, small recoup open
    {
      session: "dev",
      name: "Demo Artist",
      role: "admin",
      payoutMethod: "paypal",
      release: {
        title: "Midnight Drive",
        upc: "012345678901",
        date: "2025-08-15",
        status: "live",
        tracks: [
          { n: 1, title: "Midnight Drive", isrc: "GB-KUS-25-00001", recoup: false },
          { n: 2, title: "City Lights",    isrc: "GB-KUS-25-00002", recoup: true  },
        ],
      },
      earnings: [
        { track: 1, period: "2025-08-31", revenue: 310.00, currency: "USD" },
        { track: 1, period: "2025-08-31", revenue: 150.00, currency: "GBP" },
        { track: 2, period: "2025-08-31", revenue: 120.00, currency: "EUR" },
        { track: 1, period: "2025-09-15", revenue: 200.00, currency: "USD" },
        { track: 2, period: "2025-09-15", revenue:  90.00, currency: "EUR" },
      ],
      advances: [{ amountUSD: 500, remainingUSD: 400 }],
      costs:    [{ description: "Promo pack", amountUSD: 200, remainingUSD: 150, recoupable: true }],
      payouts: [
        { amount: 120, method: "paypal", status: "paid",    createdAt: "2025-08-20" },
        { amount:  80, method: "stripe", status: "pending", createdAt: "2025-09-05" },
      ],
    },

    // B) a1 — fully recouped already; high available balance; no payouts yet
    {
      session: "a1",
      name: "Indigo Echo",
      payoutMethod: "stripe",
      country: "US",
      release: {
        title: "Neon Skies EP",
        upc: "345678901234",
        date: "2025-07-10",
        status: "live",
        tracks: [
          { n: 1, title: "Neon Skies",   isrc: "US-IND-25-00001", recoup: true  },
          { n: 2, title: "Glass Runner", isrc: "US-IND-25-00002", recoup: true  },
        ],
      },
      earnings: [
        { track: 1, period: "2025-07-31", revenue: 500.00, currency: "USD" },
        { track: 2, period: "2025-07-31", revenue: 220.00, currency: "USD" },
        { track: 1, period: "2025-08-31", revenue: 180.00, currency: "GBP" },
        { track: 2, period: "2025-08-31", revenue: 160.00, currency: "EUR" },
        { track: 1, period: "2025-09-15", revenue: 140.00, currency: "USD" },
      ],
      advances: [{ amountUSD: 300, remainingUSD: 0, status: "closed" }],
      costs:    [{ description: "Cover art", amountUSD: 80, remainingUSD: 0, recoupable: true, status: "closed" }],
      payouts:  [],
    },

    // C) a2 — heavy open recoup; low available; recent payout already pending
    {
      session: "a2",
      name: "Crimson River",
      payoutMethod: "paypal",
      country: "GB",
      release: {
        title: "Cold Signal (Single)",
        upc: "789012345678",
        date: "2025-09-01",
        status: "live",
        tracks: [{ n: 1, title: "Cold Signal", isrc: "GB-CRM-25-00001", recoup: true }],
      },
      earnings: [
        { track: 1, period: "2025-09-10", revenue: 60.00, currency: "USD" },
        { track: 1, period: "2025-09-20", revenue: 45.00, currency: "EUR" },
      ],
      advances: [{ amountUSD: 600, remainingUSD: 550 }],
      costs:    [{ description: "PR Outreach", amountUSD: 250, remainingUSD: 200, recoupable: true }],
      payouts:  [{ amount: 25, method: "paypal", status: "pending", createdAt: "2025-09-22" }],
    },
  ];

  for (const a of artists) {
    await seedArtist(a);
  }

  // D) collaborator artist (session=collab) — will get a 30% split on a1's Track 2
  const collabUser = await prisma.user.create({
    data: { 
      name: "Guest Feature", 
      email: "artist+collab@example.com",
      passwordHash: await bcrypt.hash("password123", 12)
    }
  });
  const collab = await prisma.artist.create({
    data: { 
      userId: collabUser.id,
      name: "Guest Feature", 
      legalName: "Guest Feature",
      email: "artist+collab@example.com", 
      country: "US", 
      payoutMethod: "stripe", 
      role: "user" 
    }
  });

  // Give collaborator a 30% split on Indigo Echo's (a1) track 2
  const a1 = await prisma.artist.findUnique({ where: { email: "artist+a1@example.com" } });
  const a1Release = await prisma.release.findFirst({ where: { primaryArtistId: a1!.id } });
  const a1Track2 = await prisma.track.findFirst({ where: { releaseId: a1Release!.id, trackNumber: 2 } });
  // reduce a1's split to 70%, add 30% to collaborator
  await prisma.split.deleteMany({ where: { trackId: a1Track2!.id, artistId: a1!.id } });
  await prisma.split.createMany({
    data: [
      { trackId: a1Track2!.id, artistId: a1!.id,     percent: 70, recoupmentFlag: true  },
      { trackId: a1Track2!.id, artistId: collab.id,  percent: 30, recoupmentFlag: true  },
    ]
  });

  // E) create a Label owned by Demo Artist (session=dev) with a1 & a2 on roster
  const owner = await prisma.artist.findUnique({ where: { email: "artist+dev@example.com" } });
  const label = await prisma.label.create({
    data: { name: "Kushtunes Label", ownerId: owner!.id }
  });
  const a2 = await prisma.artist.findUnique({ where: { email: "artist+a2@example.com" } });

  await prisma.labelMember.createMany({
    data: [
      { labelId: label.id, artistId: a1!.id, role: "artist" },
      { labelId: label.id, artistId: a2!.id, role: "artist" },
      // owner can also be a manager member if you want to list them explicitly:
      { labelId: label.id, artistId: owner!.id, role: "manager" }
    ]
  });

  console.log("✅ Seeded artists:", artists.map(a => `artist+${a.session}@example.com`).join(", "));
  console.log("✅ Label seeded:", label.name, "owner:", owner!.email, "roster:", ["a1","a2"]);
  console.log("✅ Collaborator split: a1 Track#2 70/30 with", collab.email);
}

main().catch(e => { console.error(e); process.exit(1); })
       .finally(async () => { await prisma.$disconnect(); });
