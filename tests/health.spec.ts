import { test, expect } from "@playwright/test";

const ORIGIN = process.env.SITE_ORIGIN || "http://localhost:3000";

test("analytics page returns 200", async ({ request }) => {
  const res = await request.get(`${ORIGIN}/analytics`);
  expect(res.ok(), `GET /analytics => ${res.status()}`).toBeTruthy();
});

for (const route of ["/dashboard", "/releases", "/marketing", "/community"]) {
  test(`protected route redirects when unauthenticated: ${route}`, async ({ request }) => {
    const res = await request.get(`${ORIGIN}${route}`, { maxRedirects: 0 });
    expect([301,302,307,308]).toContain(res.status());
    const loc = res.headers()["location"] || res.headers()["Location"] || "";
    expect(loc.includes("/login") || loc.includes("/signin")).toBeTruthy();
  });
}
