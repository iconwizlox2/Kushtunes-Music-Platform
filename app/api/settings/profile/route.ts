import { BadRequestError, json, onError, requireUser } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const { userId } = requireUser();
    const ct = req.headers.get("content-type") || "";

    let artistName: string | undefined, email: string | undefined, country: string | undefined;

    if (ct.includes("application/json")) {
      const b = await req.json();
      artistName = (b.artistName || "").trim();
      email = (b.email || "").trim();
      country = (b.country || "").trim();
    } else {
      const fd = await req.formData();
      artistName = String(fd.get("artistName") || "").trim();
      email = String(fd.get("email") || "").trim();
      country = String(fd.get("country") || "").trim();
    }

    if (!artistName) throw new BadRequestError("Artist name required");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BadRequestError("Valid email required");

    // TODO: update user profile in DB
    return json({ ok: true, userId, artistName, email, country: country || null });
  } catch (e) {
    return onError(e);
  }
}
