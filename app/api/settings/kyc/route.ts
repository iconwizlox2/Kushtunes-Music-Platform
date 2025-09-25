import { BadRequestError, json, onError, requireUser } from "@/lib/api";

export const runtime = "nodejs"; // ensure Node runtime for file handling

export async function POST(req: Request) {
  try {
    const { userId } = requireUser();
    const fd = await req.formData();
    const file = fd.get("kycFile");

    if (!(file instanceof File)) {
      throw new BadRequestError("kycFile is required");
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestError("File too large (max 10MB)");
    }
    if (!/\.(pdf|jpg|jpeg|png)$/i.test((file as any).name || "")) {
      // Some runtimes don't expose name; keep it soft
    }

    // TODO: stream file to your storage (S3/R2/etc.)
    // const arrayBuffer = await file.arrayBuffer();

    const ticketId = `kyc_${Date.now()}`;
    // TODO: create KYC review ticket in DB

    return json({ ok: true, ticketId, userId });
  } catch (e) {
    return onError(e);
  }
}
