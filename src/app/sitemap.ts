import type { MetadataRoute } from "next";
import { readDB } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || "https://ajkpm.gok.pk";
  const db = await readDB();
  const fixed = ["", "/prime-minister", "/cabinet", "/pm-office", "/newsroom", "/notifications", "/gallery", "/videos", "/ajk-at-a-glance", "/contact"];
  return [
    ...fixed.map((p) => ({ url: `${base}${p}` })),
    ...db.pages.filter((p) => p.slug !== "ajk-at-a-glance").map((p) => ({ url: `${base}/${p.slug}`, lastModified: p.updatedAt })),
    ...db.news.filter((n) => n.published).map((n) => ({ url: `${base}/newsroom/${n.slug}`, lastModified: n.updatedAt })),
  ];
}
