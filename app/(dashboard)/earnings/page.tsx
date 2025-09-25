import type { Metadata } from "next";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Earnings",
  description: "Your earnings across stores and countries.",
  alternates: { canonical: `${siteUrl()}/earnings` },
};

type Row = { period: string; store: string; country: string; revenueUSD: number; units: number };

async function fetchEarnings(): Promise<{ totalUSD: number; rows: Row[] }> {
  // TODO: replace with your API call, e.g., fetch(`${process.env.NEXT_PUBLIC_API}/earnings`)
  // Mock data:
  return {
    totalUSD: 1234.56,
    rows: [
      { period: "2025-08", store: "Spotify", country: "GB", revenueUSD: 420.12, units: 12000 },
      { period: "2025-08", store: "Apple Music", country: "US", revenueUSD: 310.00, units: 8500 },
      { period: "2025-08", store: "YouTube", country: "IN", revenueUSD: 98.40, units: 4000 }
    ]
  };
}

export default async function EarningsPage() {
  const data = await fetchEarnings();

  return (
    <main style={{maxWidth:980, margin:"48px auto", padding:"0 16px"}}>
      <h1 style={{marginBottom:4}}>Earnings</h1>
      <p style={{opacity:.8, marginBottom:16}}>Summary of earnings by store and country.</p>

      <section style={{display:"flex", gap:16, margin:"12px 0 24px"}}>
        <div style={{border:"1px solid #eee", borderRadius:8, padding:16}}>
          <div style={{opacity:.7, fontSize:13}}>Total revenue (USD)</div>
          <div style={{fontSize:24, fontWeight:600}}>${data.totalUSD.toFixed(2)}</div>
        </div>
      </section>

      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <thead>
            <tr>
              <th style={th}>Period</th>
              <th style={th}>Store</th>
              <th style={th}>Country</th>
              <th style={thRight}>Units</th>
              <th style={thRight}>Revenue (USD)</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r, i) => (
              <tr key={i}>
                <td style={td}>{r.period}</td>
                <td style={td}>{r.store}</td>
                <td style={td}>{r.country}</td>
                <td style={tdNum}>{r.units.toLocaleString()}</td>
                <td style={tdNum}>${r.revenueUSD.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{marginTop:24}}>
        <a href="/statements">View monthly statements →</a>
      </div>
    </main>
  );
}

const th = { textAlign:"left" as const, borderBottom:"1px solid #eee", padding:"10px 8px", fontWeight:600 };
const thRight = { ...th, textAlign:"right" as const };
const td = { borderBottom:"1px solid #f1f1f1", padding:"10px 8px" };
const tdNum = { ...td, textAlign:"right" as const };