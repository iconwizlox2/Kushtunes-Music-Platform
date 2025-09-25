import { cookies } from "next/headers";
import { prisma } from "./db";

export class UnauthorizedError extends Error {}
export class BadRequestError extends Error {}
export class NotFoundError extends Error {}

export function json(data: any, init: number | ResponseInit = 200) {
  const status = typeof init === "number" ? init : (init as ResponseInit).status ?? 200;
  const headers = new Headers(typeof init === "number" ? {} : (init as ResponseInit).headers);
  if (!headers.has("content-type")) headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data), { status, headers });
}

export function onError(e: unknown) {
  if (e instanceof UnauthorizedError) return json({ error: e.message }, 401);
  if (e instanceof BadRequestError) return json({ error: e.message }, 400);
  if (e instanceof NotFoundError) return json({ error: e.message }, 404);
  console.error(e);
  return json({ error: "Internal Server Error" }, 500);
}

/**
 * Replace with NextAuth/Clerk/etc. This demo:
 * - reads "session" cookie
 * - if present, upserts a demo artist record (so DB writes work right away)
 */
export async function requireArtist() {
  const sid = cookies().get("session")?.value;
  if (!sid) throw new UnauthorizedError("Missing session");

  // DEMO: tie the cookie to a deterministic email
  const email = `artist+${sid}@example.com`;
  const artist = await prisma.artist.upsert({
    where: { email },
    update: {},
    create: { 
      name: "Demo Artist", 
      legalName: "Demo Artist Legal Name",
      email, 
      country: "GB" 
    },
  });
  return artist; // { id, name, email, ... }
}

/**
 * Admin authentication helper
 * Option A: cookie flag (fast to try); set admin=1 in your own session when needed.
 * Option B (preferred): role on Artist
 */
export async function requireAdmin() {
  // Option A: cookie flag (fast to try); set admin=1 in your own session when needed.
  const admin = cookies().get("admin")?.value === "1";
  if (admin) return true;

  // Option B (preferred): role on Artist
  try {
    const artist = await requireArtist();
    // If your schema has Artist.role: "admin" | "user"
    // @ts-ignore optional
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if ((artist as any).role === "admin") return true;
  } catch { /* ignore */ }

  throw new UnauthorizedError("Admin only");
}

/**
 * Label owner authentication helper
 */
export async function requireLabelOwner() {
  const artist = await requireArtist(); // your cookie→Artist mapping
  // treat label owner as admin-equivalent for label routes
  // If you want a stricter flag, store Artist.role = "label" or check Label.ownerId.
  const label = await prisma.label.findFirst({ where: { ownerId: artist.id }, select: { id: true, name: true } });
  if (!label) throw new UnauthorizedError("Label owner required");
  return { artist, label };
}
