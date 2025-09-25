import { json, onError, requireAdmin } from "@/lib/api";
import { prisma } from "@/lib/db";
import { parseJsonOrForm, createCostSchema } from "@/lib/validators";

export async function GET() {
  try {
    await requireAdmin();
    const items = await prisma.cost.findMany({ orderBy: { createdAt: "desc" } });
    return json({ ok: true, items });
  } catch (e) {
    return onError(e);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const { artistId, description, amountUSD, recoupable } = await parseJsonOrForm(req, createCostSchema);
    const cost = await prisma.cost.create({
      data: { artistId, description, amountUSD, remainingUSD: amountUSD, status: "open", recoupable }
    });
    return json({ ok: true, id: cost.id });
  } catch (e) {
    return onError(e);
  }
}
