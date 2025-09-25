import type { Metadata } from "next";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Releases",
  description: "Your catalog — singles, EPs, and albums.",
  alternates: { canonical: `${siteUrl()}/releases` }
};

type ReleaseRow = {
  id: string; upc?: string | null; title: string; primaryArtist: string;
  releaseDate: string; status: "draft"|"queued"|"submitted"|"delivered"|"rejected"|"live"|"takedown"
};

async function fetchReleases(): Promise<ReleaseRow[]> {
  // TODO: API
  return [
    { id: "rel_abc", upc: "012345678901", title: "Midnight Drive", primaryArtist: "Your Artist", releaseDate: "2025-10-20", status: "submitted" },
    { id: "rel_def", upc: null, title: "Rain City EP", primaryArtist: "Your Artist", releaseDate: "2025-08-15", status: "live" }
  ];
}

export default async function ReleasesPage() {
  const rows = await fetchReleases();

  return (
    <main style={{maxWidth:980, margin:"48px auto", padding:"0 16px"}}>
      <h1>Releases</h1>
      <div style={{marginBottom:12}}><a href="/upload">➕ New release</a></div>

      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <thead>
            <tr>
              <th style={th}>Title</th>
              <th style={th}>Artist</th>
              <th style={th}>Release date</th>
              <th style={th}>UPC</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td style={td}><a href={`/releases/${r.id}`}>{r.title}</a></td>
                <td style={td}>{r.primaryArtist}</td>
                <td style={td}>{r.releaseDate}</td>
                <td style={td}>{r.upc ?? "—"}</td>
                <td style={td}>{r.status}</td>
                <td style={td}>
                  <a href={`/releases/${r.id}`}>Open</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
const th = { textAlign:"left" as const, borderBottom:"1px solid #eee", padding:"10px 8px", fontWeight:600 };
const td = { borderBottom:"1px solid #f1f1f1", padding:"10px 8px" };