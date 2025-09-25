import { json, onError, requireLabelOwner, BadRequestError } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const { label } = await requireLabelOwner();
    const members = await prisma.labelMember.findMany({
      where: { labelId: label.id },
      include: { artist: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" }
    });
    return json({ ok: true, label, roster: members.map(m => m.artist) });
  } catch (e) {
    return onError(e);
  }
}

export async function POST(req: Request) {
  try {
    const { label } = await requireLabelOwner();
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim();
    if (!email) throw new BadRequestError("email required");

    const artist = await prisma.artist.findUnique({ where: { email } });
    if (!artist) throw new BadRequestError("artist not found");

    await prisma.labelMember.create({ data: { labelId: label.id, artistId: artist.id, role: "artist" } });
    return json({ ok: true });
  } catch (e) {
    return onError(e);
  }
}
