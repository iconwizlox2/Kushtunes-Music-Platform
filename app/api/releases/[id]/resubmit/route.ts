import { BadRequestError, json, onError, requireUser, NotFoundError } from "@/lib/api";

export async function POST(_req: Request, ctx: { params: { id: string } }) {
  try {
    const { userId } = requireUser();
    const releaseId = ctx.params.id;
    if (!releaseId) throw new BadRequestError("Missing release id");

    // TODO: verify ownership: release belongs to userId; fetch from DB
    const exists = true; // mock
    if (!exists) throw new NotFoundError("Release not found");

    // TODO: enqueue resubmission job (QC + delivery)
    const jobId = `job_resubmit_${Date.now()}`;

    return json({ ok: true, jobId, releaseId, userId });
  } catch (e) {
    return onError(e);
  }
}
