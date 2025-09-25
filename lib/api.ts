import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import NextAuth from "@/lib/auth";

export class UnauthorizedError extends Error {}
export class BadRequestError extends Error {}
export class NotFoundError extends Error {}

export function json(data: any, init?: ResponseInit | number) {
  const status = typeof init === "number" ? init : (init as ResponseInit)?.status ?? 200;
  const headers = new Headers(typeof init === "number" ? {} : (init as ResponseInit)?.headers);
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
 * Session-based artist authentication
 * Replaces the old cookie-based requireArtist()
 */
export async function requireArtist() {
  const session = await getServerSession(NextAuth);
  if (!session?.user?.email) throw new UnauthorizedError("Not signed in");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new UnauthorizedError("User not found");

  // Ensure artist profile exists
  const artist = await prisma.artist.upsert({
    where: { userId: user.id },
    update: {},
    create: { 
      userId: user.id, 
      name: user.name || session.user.email.split("@")[0], 
      legalName: user.name || session.user.email.split("@")[0],
      email: user.email, 
      country: "GB" 
    }
  });
  return artist;
}

/**
 * Admin authentication helper
 * Option A: cookie flag (fast to try); set admin=1 in your own session when needed.
 * Option B (preferred): role on Artist
 */
export async function requireAdmin() {
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