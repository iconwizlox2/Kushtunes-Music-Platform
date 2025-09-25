import { BadRequestError, json, onError, requireUser, NotFoundError } from "@/lib/api";

export async function POST(_req: Request, ctx: { params: { id: string } }) {
  try {
    const { userId } = requireUser();
    const releaseId = ctx.params.id;
    if (!releaseId) throw new BadRequestError("Missing release id");

    // TODO: verify ownership and current status
    const exists = true; // mock
    if (!exists) throw new NotFoundError("Release not found");

    // TODO: create takedown request in DB / call distributor
    const ticketId = `tk_${Date.now()}`;

    return json({ ok: true, ticketId, releaseId, userId });
  } catch (e) {
    return onError(e);
  }
}
