import type { Metadata } from "next";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Statements",
  description: "Download monthly statements (CSV/PDF).",
  alternates: { canonical: `${siteUrl()}/statements` },
};

type StatementRow = { period: string; csvUrl: string; pdfUrl?: string; totalUSD: number };

async function fetchStatements(): Promise<StatementRow[]> {
  // TODO: replace with real API call
  return [
    { period: "2025-08", csvUrl: "/api/stmt/2025-08/csv", pdfUrl: "/api/stmt/2025-08/pdf", totalUSD: 828.52 },
    { period: "2025-07", csvUrl: "/api/stmt/2025-07/csv", pdfUrl: "/api/stmt/2025-07/pdf", totalUSD: 612.23 }
  ];
}

export default async function StatementsPage() {
  const rows = await fetchStatements();
  return (
    <main style={{maxWidth:820, margin:"48px auto", padding:"0 16px"}}>
      <h1>Statements</h1>
      <p style={{opacity:.8, marginBottom:20}}>Download monthly CSV/PDF statements for your records.</p>
      <ul style={{listStyle:"none", padding:0, margin:0}}>
        {rows.map((s) => (
          <li key={s.period} style={{border:"1px solid #eee", borderRadius:8, padding:16, marginBottom:12}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <div>
                <div style={{fontWeight:600}}>Period: {s.period}</div>
                <div style={{opacity:.8, fontSize:13}}>Total: ${s.totalUSD.toFixed(2)}</div>
              </div>
              <div style={{display:"flex", gap:10}}>
                <a href={s.csvUrl}>Download CSV</a>
                {s.pdfUrl && <a href={s.pdfUrl}>Download PDF</a>}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div style={{marginTop:16}}>
        <a href="/payouts">Go to payouts →</a>
      </div>
    </main>
  );
}
