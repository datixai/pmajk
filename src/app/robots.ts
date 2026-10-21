import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.SITE_URL || "https://ajkpm.gok.pk";
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/search"] }], sitemap: `${base}/sitemap.xml` };
}
