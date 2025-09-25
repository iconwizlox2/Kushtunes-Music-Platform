import { json, onError, requireArtist, BadRequestError } from "@/lib/api";
import { parseJsonOrForm, payoutRequestSchema } from "@/lib/validators";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const artist = await requireArtist();
    const { amount, method } = await parseJsonOrForm(req, payoutRequestSchema);

    // Quick business rule: enforce minimum payout if you keep it in Terms (e.g., $25)
    const MIN = 25;
    if (amount < MIN) throw new BadRequestError(`Minimum payout is $${MIN}`);

    const payout = await prisma.payout.create({
      data: {
        artistId: artist.id,
        amount,
        method,
        status: "PENDING",
      },
    });

    return json({ ok: true, payoutId: payout.id });
  } catch (e) {
    return onError(e);
  }
}
