import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date().toISOString();

  const staticRoutes = [
    "", "/upload", "/pricing", "/terms", "/privacy", "/dmca", "/analytics", "/support"
  ];

  return staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.6
  }));
}
