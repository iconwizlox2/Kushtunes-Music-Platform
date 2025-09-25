import { cookies } from "next/headers";

export function requireUser() {
  // Replace with NextAuth/Clerk/etc. as needed.
  const jar = cookies();
  const sid = jar.get("session")?.value;
  if (!sid) throw new UnauthorizedError("Missing session");
  // You might decode the cookie to a user id/email here.
  return { userId: "demo-user-001", email: "artist@example.com" };
}

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
