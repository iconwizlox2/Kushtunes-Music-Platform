import type { Metadata } from "next";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Settings",
  description: "Profile, payout method, and tax/KYC information.",
  alternates: { canonical: `${siteUrl()}/settings` }
};

async function fetchSettings(): Promise<{
  artistName: string; email: string; country?: string;
  payoutMethod?: "stripe"|"paypal"|"crypto"; kycStatus: "pending"|"verified"|"rejected"
}> {
  // TODO: API
  return { artistName: "Your Artist", email: "artist@example.com", country: "GB", payoutMethod: "paypal", kycStatus: "pending" };
}

export default async function SettingsPage() {
  const s = await fetchSettings();

  return (
    <main style={{maxWidth:720, margin:"48px auto", padding:"0 16px"}}>
      <h1>Settings</h1>

      <section style={card}>
        <h2 style={{marginTop:0}}>Profile</h2>
        <form method="post" action="/api/settings/profile">
          <label style={lbl}>Artist name<input name="artistName" defaultValue={s.artistName} style={inp} /></label>
          <label style={lbl}>Email<input name="email" type="email" defaultValue={s.email} style={inp} /></label>
          <label style={lbl}>Country<input name="country" defaultValue={s.country || ""} style={inp} /></label>
          <button type="submit">Save profile</button>
        </form>
      </section>

      <section style={card}>
        <h2 style={{marginTop:0}}>Payout method</h2>
        <form method="post" action="/api/settings/payout">
          <label style={lbl}>Method
            <select name="method" defaultValue={s.payoutMethod} style={inp}>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="crypto">Crypto</option>
            </select>
          </label>
          <div style={{opacity:.7, fontSize:12, marginBottom:10}}>You can change this method later.</div>
          <button type="submit">Save payout method</button>
        </form>
      </section>

      <section style={card}>
        <h2 style={{marginTop:0}}>KYC / Tax</h2>
        <p style={{marginTop:0}}>Status: <strong>{s.kycStatus}</strong></p>
        <form method="post" action="/api/settings/kyc" encType="multipart/form-data">
          <label style={lbl}>Upload ID (PDF/JPG/PNG)
            <input name="kycFile" type="file" accept=".pdf,.jpg,.jpeg,.png" />
          </label>
          <button type="submit">Submit for review</button>
        </form>
      </section>
    </main>
  );
}

const card: React.CSSProperties = { border:"1px solid #eee", borderRadius:8, padding:16, marginBottom:16 };
const lbl: React.CSSProperties = { display:"block", marginBottom:8 };
const inp: React.CSSProperties = { display:"block", width:"100%", padding:"8px 10px", marginTop:6 };
