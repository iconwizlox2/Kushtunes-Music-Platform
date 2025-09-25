import type { Metadata } from "next";
import { siteUrl } from "@/lib/env";
import DateRangePicker from "@/components/DateRangePicker";
import RemoveMemberButton from "@/components/RemoveMemberButton";

export const metadata: Metadata = {
  title: "Label · Roster",
  alternates: { canonical: `${siteUrl()}/label/roster` }
};

async function fetchRoster() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  const res = await fetch(`${base}/api/label/roster`, { cache: "no-store" });
  if (!res.ok) return { label: null, roster: [] };
  return await res.json();
}

async function fetchBalances(searchParams: { start?: string; end?: string }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  const qs = new URLSearchParams();
  if (searchParams.start) qs.set("start", searchParams.start);
  if (searchParams.end) qs.set("end", searchParams.end);
  const res = await fetch(`${base}/api/label/balances${qs.toString() ? `?${qs.toString()}` : ""}`, { cache: "no-store" });
  if (!res.ok) return { rows: [], totals: { earnedUSD:0, recoupAppliedUSD:0, paidOrPendingUSD:0, availableUSD:0 } };
  return await res.json();
}

export default async function LabelRosterPage({ searchParams }: { searchParams: { start?: string; end?: string } }) {
  const { label, roster } = await fetchRoster();
  const { rows, totals } = await fetchBalances(searchParams);

  return (
    <main style={{maxWidth:980, margin:"48px auto", padding:"0 16px"}}>
      <h1>Label · Roster</h1>
      <p style={{opacity:.8}}>{label ? label.name : "Label"}</p>

      <DateRangePicker />

      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, margin:"12px 0 20px"}}>
        <Card title="Earned" value={fmt(totals.earnedUSD)} />
        <Card title="Recoup applied" value={`-${fmt(totals.recoupAppliedUSD)}`} />
        <Card title="Payouts (pend+paid)" value={`-${fmt(totals.paidOrPendingUSD)}`} />
        <Card title="Available" value={fmt(totals.availableUSD)} />
      </div>

      <h2>Artists</h2>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <thead>
            <tr>
              <Th>Artist</Th><Th>Email</Th>
              <Th right>Earned</Th><Th right>Recoup</Th><Th right>Payouts</Th><Th right>Available</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r:any)=>(
              <tr key={r.artistId} data-artist={r.artistId}>
                <Td>{r.name}</Td>
                <Td>{r.email}</Td>
                <Td right>{fmt(r.earnedUSD)}</Td>
                <Td right>-{fmt(r.recoupAppliedUSD)}</Td>
                <Td right>-{fmt(r.paidOrPendingUSD)}</Td>
                <Td right>{fmt(r.availableUSD)}</Td>
                <Td>
                  <RemoveMemberButton artistId={r.artistId} artistName={r.name} />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{marginTop:24}}>Add artist to roster</h2>
      <form method="post" action="/api/label/roster" style={{display:"flex", gap:8, alignItems:"center"}}>
        <input type="email" name="email" placeholder="artist email" required style={{padding:"8px 10px", width:280}} />
        <button type="submit">Add</button>
      </form>

      <p style={{opacity:.7, fontSize:12, marginTop:8}}>To remove: use the Remove button above or wire a button that DELETEs <code>/api/label/roster/&lt;artistId&gt;</code>.</p>
    </main>
  );
}

function fmt(n:number){ return `$${(n||0).toFixed(2)}`; }
function Card({ title, value }: { title: string; value: string }) {
  return <div style={{border:"1px solid #eee", borderRadius:8, padding:16}}>
    <div style={{opacity:.7, fontSize:13}}>{title}</div>
    <div style={{fontSize:24, fontWeight:600}}>{value}</div>
  </div>;
}
function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <th style={{ textAlign: right ? "right" : "left", borderBottom:"1px solid #eee", padding:"10px 8px", fontWeight:600 }}>{children}</th>;
}
function Td({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <td style={{ textAlign: right ? "right" : "left", borderBottom:"1px solid #f1f1f1", padding:"10px 8px" }}>{children}</td>;
}
