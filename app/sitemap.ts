import type { MetadataRoute } from "next";
import { absoluteUrl, getSiteConfig, publicRoutes } from "@/modules/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const { siteUrl } = getSiteConfig();
  return publicRoutes().map((path) => ({ url: absoluteUrl(path, siteUrl) }));
}
