export async function GET(_req: Request, { params }: { params: { period: string } }) {
  const { period } = params; // e.g., "2025-08"
  const rows = [
    ["period","store","country","isrc","units","revenue","currency"],
    [period,"Spotify","GB","GBABC25001","12000","420.12","USD"],
    [period,"Apple Music","US","GBABC25001","8500","310.00","USD"],
    [period,"YouTube","IN","GBABC25001","4000","98.40","USD"]
  ];
  const body = rows.map(r => r.join(",")).join("\n");
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="statement-${period}.csv"`
    }
  });
}
