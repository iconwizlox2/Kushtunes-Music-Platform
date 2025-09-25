import { json, onError, requireArtist, NotFoundError } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function POST(_req: Request, ctx: { params: { id: string } }) {
  try {
    const artist = await requireArtist();
    const { id } = ctx.params;

    const release = await prisma.release.findFirst({
      where: { id, primaryArtistId: artist.id },
      select: { id: true, status: true },
    });
    if (!release) throw new NotFoundError("Release not found");

    // Example: set status back to 'queued' and create a Delivery row for ALL
    await prisma.release.update({
      where: { id: release.id },
      data: { status: "UNDER_REVIEW" },
    });
    await prisma.delivery.create({
      data: { releaseId: release.id, store: "ALL", status: "PENDING", message: "Resubmission requested" },
    });

    // Audit
    const log = await prisma.auditLog.create({
      data: {
        artistId: artist.id,
        action: "release.resubmit",
        entity: "release",
        entityId: release.id,
        newValues: {},
      },
    });

    return json({ ok: true, jobId: log.id });
  } catch (e) {
    return onError(e);
  }
}
