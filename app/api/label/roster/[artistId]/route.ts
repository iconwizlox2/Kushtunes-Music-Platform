import { json, onError, requireLabelOwner } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function DELETE(_req: Request, ctx: { params: { artistId: string } }) {
  try {
    const { label } = await requireLabelOwner();
    await prisma.labelMember.delete({ where: { labelId_artistId: { labelId: label.id, artistId: ctx.params.artistId } } });
    return json({ ok: true });
  } catch (e) {
    return onError(e);
  }
}
