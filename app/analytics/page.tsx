export const dynamic = "force-static";

export default function AnalyticsComingSoon() {
  return (
    <main style={{maxWidth:880,margin:"48px auto",padding:"0 16px",fontFamily:"system-ui"}}>
      <h1 style={{fontSize:36,marginBottom:8}}>Analytics</h1>
      <p style={{opacity:.8,marginBottom:24}}>
        We're building a clean analytics view for streams, playlists, countries, and store splits.
      </p>
      <div style={{border:"1px solid #eee",borderRadius:8,padding:16}}>
        <h2 style={{marginTop:0}}>Coming soon</h2>
        <ul>
          <li>Streams by store & country</li>
          <li>Playlist adds & velocity</li>
          <li>Royalties timeline</li>
        </ul>
      </div>
    </main>
  );
}
