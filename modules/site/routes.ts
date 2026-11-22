import { BANKS } from "@/modules/banks";
import { GYAN_PAGES } from "@/modules/gyan";
import { TURANT_SLUGS } from "@/modules/scams";

// साइट के सारे public पन्ने, data से बने (sitemap इन्हीं से बनता है, इसलिए नया पन्ना जुड़े तो यहाँ जोड़ें)
export function publicRoutes(): string[] {
  return [
    "/",
    "/turant",
    ...TURANT_SLUGS.map((s) => `/turant/${s}`),
    "/pucho",
    "/haq",
    "/haq/thagi",
    "/haq/failed-txn",
    "/haq/frozen-money",
    "/shikayat-rasta",
    "/gyan",
    ...GYAN_PAGES.map((p) => `/gyan/${p.slug}`),
    "/gyan/bank",
    ...BANKS.map((b) => `/gyan/bank/${b.slug}`),
    "/bharosa",
    "/legal",
    "/legal/privacy",
    "/legal/terms",
    "/legal/shikayat",
  ];
}

export function absoluteUrl(path: string, siteUrl: string): string {
  return `${siteUrl.replace(/\/+$/, "")}${path}`;
}
