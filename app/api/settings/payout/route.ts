import { BadRequestError, json, onError, requireUser } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const { userId } = requireUser();
    const ct = req.headers.get("content-type") || "";
    let method: "stripe"|"paypal"|"crypto" | undefined;

    if (ct.includes("application/json")) {
      const b = await req.json();
      method = b.method;
    } else {
      const fd = await req.formData();
      method = fd.get("method") as any;
    }

    if (!["stripe","paypal","crypto"].includes(method as any)) {
      throw new BadRequestError("Invalid method");
    }

    // TODO: persist payout method
    return json({ ok: true, userId, method });
  } catch (e) {
    return onError(e);
  }
}
