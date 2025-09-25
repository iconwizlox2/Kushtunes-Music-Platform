import type { Metadata } from "next";
import { siteUrl } from "@/lib/env";
import DateRangePicker from "@/components/DateRangePicker";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payouts",
  description: "Request a payout and see recent transactions.",
  alternates: { canonical: `${siteUrl()}/payouts` }
};

async function fetchBalance(searchParams: { start?: string; end?: string }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  const qs = new URLSearchParams();
  if (searchParams.start) qs.set("start", searchParams.start);
  if (searchParams.end) qs.set("end", searchParams.end);
  const res = await fetch(`${base}/api/earnings/available${qs.toString() ? `?${qs.toString()}` : ""}`, { cache: "no-store" });
  if (!res.ok) return { availableUSD: 0, earnedUSD: 0, recoupAppliedUSD: 0, paidOrPendingUSD: 0, openRecoupUSD: 0, window: {} };
  return await res.json();
}

type Payout = { id: string; amountUSD: number; method: "stripe"|"paypal"|"crypto"; status: "pending"|"paid"|"rejected"; createdAt: string };
async function fetchPayouts(): Promise<Payout[]> {
  // TODO: hook to your API
  return [
    { id: "po_123", amountUSD: 120, method: "paypal", status: "paid", createdAt: "2025-08-20" },
    { id: "po_124", amountUSD: 80, method: "stripe", status: "pending", createdAt: "2025-09-05" }
  ];
}

export default async function PayoutsPage({ searchParams }: { searchParams: { start?: string; end?: string } }) {
  const bal = await fetchBalance(searchParams);
  const payouts = await fetchPayouts();
  const MIN = 25;

  return (
    <main style={{maxWidth:820, margin:"48px auto", padding:"0 16px"}}>
      <h1>Payouts</h1>
      <DateRangePicker />
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, margin:"12px 0 16px"}}>
        <Card title="Earned (USD)" value={`$${(bal.earnedUSD||0).toFixed(2)}`} />
        <Card title="Available (USD)" value={`$${(bal.availableUSD||0).toFixed(2)}`} />
      </div>

      <div style={{border:"1px solid #eee", borderRadius:8, padding:16, marginBottom:24}}>
        <strong>Breakdown</strong>
        <ul style={{margin:"8px 0 0 16px"}}>
          <li>Recoup applied: <strong>-${(bal.recoupAppliedUSD||0).toFixed(2)}</strong> {bal.openRecoupUSD ? `(open recoup: $${(bal.openRecoupUSD||0).toFixed(2)})` : ""}</li>
          <li>Payouts (pending+paid): <strong>-${(bal.paidOrPendingUSD||0).toFixed(2)}</strong></li>
        </ul>
      </div>

      {/* Request payout */}
      <form method="post" action="/api/payouts/request" style={{border:"1px solid #eee", borderRadius:8, padding:16, marginBottom:24}}>
        <label style={{display:"block", marginBottom:8}}>
          Amount (USD)
          <input name="amount" type="number" min={MIN} max={Math.max(MIN, bal.availableUSD||0)} step="0.01"
                 defaultValue={Math.min(Math.max(MIN, bal.availableUSD||0), 100)} style={inp}/>
        </label>
        <label style={{display:"block", marginBottom:8}}>
          Method
          <select name="method" style={inp}>
            <option value="stripe">Stripe</option>
            <option value="paypal">PayPal</option>
            <option value="crypto">Crypto</option>
          </select>
        </label>
        <button type="submit" disabled={(bal.availableUSD||0) < MIN}>Request payout</button>
        <div style={{opacity:.7, fontSize:12, marginTop:8}}>Minimum payout: ${MIN}. Processing ~30 days.</div>
      </form>

      <h2>Recent payouts</h2>
      <table style={{width:"100%", borderCollapse:"collapse"}}>
        <thead>
          <tr><Th>ID</Th><Th>Date</Th><Th right>Amount</Th><Th>Method</Th><Th>Status</Th></tr>
        </thead>
        <tbody>
          {payouts.map(p => (
            <tr key={p.id}>
              <Td>{p.id}</Td>
              <Td>{p.createdAt}</Td>
              <Td right>${p.amountUSD.toFixed(2)}</Td>
              <Td>{p.method}</Td>
              <Td>{p.status}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div style={{border:"1px solid #eee", borderRadius:8, padding:16}}>
      <div style={{opacity:.7, fontSize:13}}>{title}</div>
      <div style={{fontSize:24, fontWeight:600}}>{value}</div>
    </div>
  );
}
function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <th style={{ textAlign: right ? "right" : "left", borderBottom:"1px solid #eee", padding:"10px 8px", fontWeight:600 }}>{children}</th>;
}
function Td({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <td style={{ textAlign: right ? "right" : "left", borderBottom:"1px solid #f1f1f1", padding:"10px 8px" }}>{children}</td>;
}
const inp: React.CSSProperties = { display:"block", width:"100%", padding:"8px 10px", marginTop:6 };
