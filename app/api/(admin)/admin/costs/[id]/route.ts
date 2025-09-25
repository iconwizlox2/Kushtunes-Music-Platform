import { json, onError, requireAdmin, BadRequestError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { parseJsonOrForm, updateCostSchema } from "@/lib/validators";

export async function POST(req: Request, ctx: { params: { id: string } }) {
  try {
    await requireAdmin();
    const ct = req.headers.get("content-type") || "";
    const isForm = !ct.includes("application/json");
    const method = isForm ? String((await req.formData()).get("_method") || "POST") : (await req.json())._method;

    if (method === "PATCH") return PATCH(req, ctx);
    if (method === "DELETE") return DELETE(req, ctx);
    throw new BadRequestError("Unsupported _method");
  } catch (e) {
    return onError(e);
  }
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  try {
    await requireAdmin();
    const id = ctx.params.id;
    const body = await parseJsonOrForm(req, updateCostSchema);
    const cost = await prisma.cost.update({
      where: { id },
      data: {
        ...(body.remainingUSD !== undefined ? { remainingUSD: body.remainingUSD } : {}),
        ...(body.status ? { status: body.status } : {}),
      }
    });
    return json({ ok: true, id: cost.id });
  } catch (e) {
    return onError(e);
  }
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  try {
    await requireAdmin();
    const id = ctx.params.id;
    await prisma.cost.delete({ where: { id } });
    return json({ ok: true });
  } catch (e) {
    return onError(e);
  }
}
