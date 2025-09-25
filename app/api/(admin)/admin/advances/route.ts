import { json, onError, requireAdmin } from "@/lib/api";
import { prisma } from "@/lib/db";
import { parseJsonOrForm, createAdvanceSchema } from "@/lib/validators";

export async function GET() {
  try {
    await requireAdmin();
    const items = await prisma.advance.findMany({ orderBy: { createdAt: "desc" } });
    return json({ ok: true, items });
  } catch (e) {
    return onError(e);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const { artistId, amountUSD } = await parseJsonOrForm(req, createAdvanceSchema);
    const adv = await prisma.advance.create({
      data: { artistId, amountUSD, remainingUSD: amountUSD, status: "open" }
    });
    return json({ ok: true, id: adv.id });
  } catch (e) {
    return onError(e);
  }
}
