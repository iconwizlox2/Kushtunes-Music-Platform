import type { Metadata, ResolvingMetadata } from "next";
import { siteUrl } from "@/lib/env";
import { prisma } from "@/lib/db";
import { requireArtist } from "@/lib/api";

type Delivery = { store: string; status: "queued"|"sent"|"ingested"|"live"|"error"|"takedown"; message?: string; link?: string };
type Track = { trackNumber: number; title: string; isrc?: string | null; explicit?: boolean };
type Release = {
  id: string; title: string; primaryArtist: string; upc?: string | null;
  releaseDate: string; coverUrl?: string | null; status: string;
  deliveries: Delivery[]; tracks: Track[];
};

async function fetchRelease(id: string): Promise<Release | null> {
  const artist = await requireArtist();
  const r = await prisma.release.findFirst({
    where: { id, primaryArtistId: artist.id },
    include: {
      tracks: { select: { trackNumber: true, title: true, isrc: true, explicit: true } },
      deliveries: { select: { store: true, status: true, message: true } },
      primaryArtist: { select: { name: true } },
    },
  });
  if (!r) return null;
  return {
    id: r.id,
    title: r.title,
    primaryArtist: r.primaryArtist.name,
    upc: r.upc,
    releaseDate: r.releaseDate.toISOString().slice(0,10),
    coverUrl: r.coverUrl,
    status: r.status,
    tracks: r.tracks.map(t => ({
      trackNumber: t.trackNumber,
      title: t.title,
      isrc: t.isrc,
      explicit: t.explicit,
    })),
    deliveries: r.deliveries.map(d => ({
      store: d.store, status: d.status as any, message: d.message ?? undefined
    })),
  };
}

export async function generateMetadata(
  { params }: { params: { id: string } },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const base = siteUrl();
  const rel = await fetchRelease(params.id);
  const title = rel ? `${rel.title} — ${rel.primaryArtist}` : "Release";
  return {
    title,
    description: "Release details and delivery status.",
    alternates: { canonical: `${base}/releases/${params.id}` },
    openGraph: {
      url: `${base}/releases/${params.id}`,
      images: rel?.coverUrl ? [rel.coverUrl] : [`${base}/og-image.png`]
    }
  };
}

export default async function ReleaseDetailPage({ params }: { params: { id: string } }) {
  const rel = await fetchRelease(params.id);
  if (!rel) return <main style={{maxWidth:860, margin:"48px auto", padding:"0 16px"}}><h1>Release not found</h1></main>;

  return (
    <main style={{maxWidth:980, margin:"48px auto", padding:"0 16px"}}>
      <div style={{display:"flex", gap:16, alignItems:"center", marginBottom:16}}>
        {rel.coverUrl && <img src={rel.coverUrl} alt={`${rel.title} cover`} width={120} height={120} style={{borderRadius:8, objectFit:"cover"}} />}
        <div>
          <h1 style={{margin:0}}>{rel.title}</h1>
          <div style={{opacity:.8}}>{rel.primaryArtist}</div>
          <div style={{opacity:.8, fontSize:13, marginTop:4}}>UPC: {rel.upc ?? "—"} · Release date: {rel.releaseDate}</div>
          <div style={{marginTop:8}}><strong>Status:</strong> {rel.status}</div>
        </div>
      </div>

      <h2 style={{marginTop:24}}>Tracks</h2>
      <table style={{width:"100%", borderCollapse:"collapse", marginBottom:20}}>
        <thead>
          <tr>
            <th style={th}>#</th>
            <th style={th}>Title</th>
            <th style={th}>ISRC</th>
            <th style={th}>Explicit</th>
          </tr>
        </thead>
        <tbody>
          {rel.tracks.map(t => (
            <tr key={t.trackNumber}>
              <td style={td}>{t.trackNumber}</td>
              <td style={td}>{t.title}</td>
              <td style={td}>{t.isrc ?? "—"}</td>
              <td style={td}>{t.explicit ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Delivery status</h2>
      <table style={{width:"100%", borderCollapse:"collapse"}}>
        <thead>
          <tr>
            <th style={th}>Store</th>
            <th style={th}>Status</th>
            <th style={th}>Message</th>
            <th style={th}>Link</th>
          </tr>
        </thead>
        <tbody>
          {rel.deliveries.map((d, i) => (
            <tr key={i}>
              <td style={td}>{d.store}</td>
              <td style={td}>{d.status}</td>
              <td style={td}>{d.message ?? "—"}</td>
              <td style={td}>{d.link ? <a href={d.link} target="_blank">Open</a> : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{display:"flex", gap:12, marginTop:16}}>
        <form method="post" action={`/api/releases/${rel.id}/resubmit`}><button>Resubmit</button></form>
        <form method="post" action={`/api/releases/${rel.id}/takedown`}><button>Request takedown</button></form>
        <a href="/releases">Back to releases</a>
      </div>
    </main>
  );
}

const th = { textAlign:"left" as const, borderBottom:"1px solid #eee", padding:"10px 8px", fontWeight:600 };
const td = { borderBottom:"1px solid #f1f1f1", padding:"10px 8px" };
