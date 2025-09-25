import { BadRequestError, json, onError, requireArtist } from "@/lib/api";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const artist = await requireArtist();
    const fd = await req.formData();
    const file = fd.get("kycFile");
    if (!(file instanceof File)) throw new BadRequestError("kycFile is required");
    if (file.size > 10 * 1024 * 1024) throw new BadRequestError("File too large (max 10MB)");

    // TODO: upload to storage (S3/R2) and capture URL
    const storageUrl = `uploaded://${Date.now()}-${(file as any).name ?? "kyc"}`;

    // Save as an audit log so you can track review in admin
    const log = await prisma.auditLog.create({
      data: {
        artistId: artist.id,
        action: "kyc.upload",
        entity: "artist",
        entityId: artist.id,
        newValues: { storageUrl, size: file.size, type: (file as any).type ?? null },
      },
    });

    return json({ ok: true, ticketId: log.id });
  } catch (e) {
    return onError(e);
  }
}
