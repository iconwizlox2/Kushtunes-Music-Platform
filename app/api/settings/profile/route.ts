import { json, onError, requireArtist } from "@/lib/api";
import { parseJsonOrForm, profileSchema } from "@/lib/validators";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const artist = await requireArtist();
    const { artistName, email, country } = await parseJsonOrForm(req, profileSchema);

    const updated = await prisma.artist.update({
      where: { id: artist.id },
      data: { name: artistName, email, country: country || "US" },
      select: { id: true, name: true, email: true, country: true },
    });

    return json({ ok: true, artist: updated });
  } catch (e) {
    return onError(e);
  }
}
