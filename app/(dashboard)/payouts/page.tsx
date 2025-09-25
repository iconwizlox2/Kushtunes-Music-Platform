import type { Metadata } from "next";
import { siteUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payouts",
  description: "Request a payout and see recent transactions.",
  alternates: { canonical: `${siteUrl()}/payouts` }
};

type Payout = { id: string; amountUSD: number; method: "stripe"|"paypal"|"crypto"; status: "pending"|"paid"|"rejected"; createdAt: string };

async function fetchBalance(params?: { start?: string; end?: string }): Promise<{ availableUSD: number; minPayoutUSD: number; window?: { start?: string|null, end?: string|null } }> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const qs = new URLSearchParams();
  if (params?.start) qs.set("start", params.start);
  if (params?.end) qs.set("end", params.end);

  try {
    const res = await fetch(`${base}/api/earnings/available${qs.toString() ? `?${qs.toString()}` : ""}`, { 
      cache: "no-store"
    });
    if (!res.ok) return { availableUSD: 0, minPayoutUSD: 25 };
    const data = await res.json();
    return { availableUSD: data.availableUSD || 0, minPayoutUSD: 25, window: data.window };
  } catch {
    return { availableUSD: 0, minPayoutUSD: 25 };
  }
}

async function fetchPayouts(): Promise<Payout[]> {
  // TODO: API
  return [
    { id: "po_123", amountUSD: 120, method: "paypal", status: "paid", createdAt: "2025-08-20" },
    { id: "po_124", amountUSD: 80, method: "stripe", status: "pending", createdAt: "2025-09-05" }
  ];
}

export default async function PayoutsPage() {
  const { availableUSD, minPayoutUSD } = await fetchBalance();
  const payouts = await fetchPayouts();

  return (
    <main style={{maxWidth:720, margin:"48px auto", padding:"0 16px"}}>
      <h1>Payouts</h1>
      <div style={{display:"flex", gap:16, margin:"12px 0 24px"}}>
        <div style={{border:"1px solid #eee", borderRadius:8, padding:16}}>
          <div style={{opacity:.7, fontSize:13}}>Available balance</div>
          <div style={{fontSize:24, fontWeight:600}}>${availableUSD.toFixed(2)}</div>
          <div style={{opacity:.7, fontSize:12, marginTop:4}}>Minimum payout: ${minPayoutUSD.toFixed(2)}</div>
        </div>
      </div>

      {/* Minimal server form (replace with real action) */}
      <form method="post" action="/api/payouts/request" style={{border:"1px solid #eee", borderRadius:8, padding:16, marginBottom:24}}>
        <label style={{display:"block", marginBottom:8}}>
          Amount (USD)
          <input name="amount" type="number" min={minPayoutUSD} max={availableUSD} step="0.01" defaultValue={Math.max(minPayoutUSD, Math.min(availableUSD, 100))} style={inp}/>
        </label>
        <label style={{display:"block", marginBottom:8}}>
          Method
          <select name="method" style={inp}>
            <option value="stripe">Stripe</option>
            <option value="paypal">PayPal</option>
            <option value="crypto">Crypto</option>
          </select>
        </label>
        <button type="submit">Request payout</button>
        <div style={{opacity:.7, fontSize:12, marginTop:8}}>
          Payouts are processed in ~30 days (see Terms).
        </div>
      </form>

      <h2 style={{marginBottom:8}}>Recent payouts</h2>
      <table style={{width:"100%", borderCollapse:"collapse"}}>
        <thead>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Date</th>
            <th style={thRight}>Amount</th>
            <th style={th}>Method</th>
            <th style={th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map(p => (
            <tr key={p.id}>
              <td style={td}>{p.id}</td>
              <td style={td}>{p.createdAt}</td>
              <td style={tdNum}>${p.amountUSD.toFixed(2)}</td>
              <td style={td}>{p.method}</td>
              <td style={td}>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
const th = { textAlign:"left" as const, borderBottom:"1px solid #eee", padding:"10px 8px", fontWeight:600 };
const thRight = { ...th, textAlign:"right" as const };
const td = { borderBottom:"1px solid #f1f1f1", padding:"10px 8px" };
const tdNum = { ...td, textAlign:"right" as const };
const inp: React.CSSProperties = { display:"block", width:"100%", padding:"8px 10px", marginTop:6 };
