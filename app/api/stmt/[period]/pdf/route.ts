export async function GET(_req: Request, { params }: { params: { period: string } }) {
  // Minimal placeholder PDF (really just a text; replace with real PDF bytes)
  const text = `Statement ${params.period}\n=====================\nTotal: $0.00\n`;
  return new Response(Buffer.from(text, "utf-8"), {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="statement-${params.period}.pdf"`
    }
  });
}
