import type { Metadata } from "next";
import { siteUrl } from "@/lib/env";
import { requireAdmin } from "@/lib/api";

export const metadata: Metadata = {
  title: "Admin · Recoup",
  alternates: { canonical: `${siteUrl()}/admin/recoup` }
};

async function fetchData() {
  // Fetch both resources
  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  const [adv, cost] = await Promise.all([
    fetch(`${base}/api/admin/advances`, { cache: "no-store" }).then(r=>r.json()),
    fetch(`${base}/api/admin/costs`, { cache: "no-store" }).then(r=>r.json()),
  ]);
  return { advances: adv.items || [], costs: cost.items || [] };
}

export default async function AdminRecoupPage() {
  await requireAdmin(); // server-side guard
  const { advances, costs } = await fetchData();

  return (
    <main style={{maxWidth:980, margin:"48px auto", padding:"0 16px"}}>
      <h1>Admin · Recoup</h1>

      <section style={card}>
        <h2 style={{marginTop:0}}>Create Advance</h2>
        <form method="post" action="/api/admin/advances">
          <div style={grid}>
            <label>Artist ID<input name="artistId" required style={inp}/></label>
            <label>Amount USD<input name="amountUSD" type="number" step="0.01" min="0.01" required style={inp}/></label>
          </div>
          <button type="submit">Create</button>
        </form>
      </section>

      <section style={card}>
        <h2 style={{marginTop:0}}>Create Cost</h2>
        <form method="post" action="/api/admin/costs">
          <div style={grid}>
            <label>Artist ID<input name="artistId" required style={inp}/></label>
            <label>Description<input name="description" required style={inp}/></label>
            <label>Amount USD<input name="amountUSD" type="number" step="0.01" min="0.01" required style={inp}/></label>
            <label>Recoupable<select name="recoupable" style={inp}><option value="true">true</option><option value="false">false</option></select></label>
          </div>
          <button type="submit">Create</button>
        </form>
      </section>

      <h2>Advances</h2>
      <Table>
        <thead><tr><Th>ID</Th><Th>Artist</Th><Th right>Remaining</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
        <tbody>
          {advances.map((a:any)=>(
            <tr key={a.id}>
              <Td>{a.id}</Td>
              <Td>{a.artistId}</Td>
              <Td right>${Number(a.remainingUSD).toFixed(2)}</Td>
              <Td>{a.status}</Td>
              <Td>
                <form method="post" action={`/api/admin/advances/${a.id}`} style={{display:"inline-block", marginRight:8}}>
                  <input type="hidden" name="_method" value="PATCH" />
                  <input name="remainingUSD" placeholder="new remaining" step="0.01" style={{...inp, width:160}}/>
                  <select name="status" style={{...inp, width:120}}>
                    <option>open</option><option>closed</option>
                  </select>
                  <button>Update</button>
                </form>
                <form method="post" action={`/api/admin/advances/${a.id}`} style={{display:"inline-block"}}
                      onSubmit={(e)=>{ if(!confirm("Delete advance?")) e.preventDefault(); }}>
                  <input type="hidden" name="_method" value="DELETE" />
                  <button>Delete</button>
                </form>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2 style={{marginTop:24}}>Costs</h2>
      <Table>
        <thead><tr><Th>ID</Th><Th>Artist</Th><Th>Description</Th><Th right>Remaining</Th><Th>Recoupable</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
        <tbody>
          {costs.map((c:any)=>(
            <tr key={c.id}>
              <Td>{c.id}</Td>
              <Td>{c.artistId}</Td>
              <Td>{c.description}</Td>
              <Td right>${Number(c.remainingUSD).toFixed(2)}</Td>
              <Td>{String(c.recoupable)}</Td>
              <Td>{c.status}</Td>
              <Td>
                <form method="post" action={`/api/admin/costs/${c.id}`} style={{display:"inline-block", marginRight:8}}>
                  <input type="hidden" name="_method" value="PATCH" />
                  <input name="remainingUSD" placeholder="new remaining" step="0.01" style={{...inp, width:160}}/>
                  <select name="status" style={{...inp, width:120}}>
                    <option>open</option><option>closed</option>
                  </select>
                  <button>Update</button>
                </form>
                <form method="post" action={`/api/admin/costs/${c.id}`} style={{display:"inline-block"}}
                      onSubmit={(e)=>{ if(!confirm("Delete cost?")) e.preventDefault(); }}>
                  <input type="hidden" name="_method" value="DELETE" />
                  <button>Delete</button>
                </form>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </main>
  );
}

const card: React.CSSProperties = { border:"1px solid #eee", borderRadius:8, padding:16, marginBottom:16 };
const grid: React.CSSProperties = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 };
const inp: React.CSSProperties = { display:"block", width:"100%", padding:"8px 10px", marginTop:6 };

function Table({ children }: { children: React.ReactNode }) {
  return <table style={{width:"100%", borderCollapse:"collapse"}}>{children}</table>;
}
function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <th style={{ textAlign: right ? "right" : "left", borderBottom:"1px solid #eee", padding:"10px 8px", fontWeight:600 }}>{children}</th>;
}
function Td({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <td style={{ textAlign: right ? "right" : "left", borderBottom:"1px solid #f1f1f1", padding:"10px 8px" }}>{children}</td>;
}
