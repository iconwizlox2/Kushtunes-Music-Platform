import { BadRequestError, json, onError, requireUser } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const { userId } = requireUser();
    const ct = req.headers.get("content-type") || "";
    let amount: number | undefined, method: "stripe"|"paypal"|"crypto" | undefined;

    if (ct.includes("application/json")) {
      const body = await req.json();
      amount = Number(body.amount);
      method = body.method;
    } else {
      const fd = await req.formData();
      amount = Number(fd.get("amount"));
      method = fd.get("method") as any;
    }

    if (!amount || amount <= 0) throw new BadRequestError("Amount must be > 0");
    if (!["stripe","paypal","crypto"].includes(method as any)) throw new BadRequestError("Invalid method");

    // TODO: call your service -> create payout record
    const payoutId = `po_${Date.now()}`;

    return json({ ok: true, payoutId, userId });
  } catch (e) {
    return onError(e);
  }
}
