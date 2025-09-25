import { json, onError, requireArtist } from "@/lib/api";
import { parseJsonOrForm, payoutMethodSchema } from "@/lib/validators";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const artist = await requireArtist();
    const { method } = await parseJsonOrForm(req, payoutMethodSchema);

    await prisma.artist.update({
      where: { id: artist.id },
      data: { payoutMethod: method },
    });

    return json({ ok: true, method });
  } catch (e) {
    return onError(e);
  }
}
