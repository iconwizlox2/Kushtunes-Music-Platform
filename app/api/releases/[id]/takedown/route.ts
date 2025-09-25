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

    await prisma.release.update({
      where: { id: release.id },
      data: { status: "REJECTED" },
    });
    await prisma.delivery.create({
      data: { releaseId: release.id, store: "ALL", status: "REJECTED", message: "Takedown requested" },
    });

    await prisma.auditLog.create({
      data: {
        artistId: artist.id,
        action: "release.takedown",
        entity: "release",
        entityId: release.id,
      },
    });

    return json({ ok: true });
  } catch (e) {
    return onError(e);
  }
}
