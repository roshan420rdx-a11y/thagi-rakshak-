import type { MetadataRoute } from "next";
import { absoluteUrl, getSiteConfig } from "@/modules/site";

export default function robots(): MetadataRoute.Robots {
  const { siteUrl } = getSiteConfig();
  return { rules: { userAgent: "*", allow: "/" }, sitemap: absoluteUrl("/sitemap.xml", siteUrl) };
}
