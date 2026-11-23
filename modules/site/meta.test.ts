import { expect, test } from "vitest";
import { OG_IMAGE, pageMeta } from "@/modules/site/meta";

test("हर पन्ने के preview में वही तस्वीर (1200×630, हिंदी alt में 1930)", () => {
  const m = pageMeta({ title: "जाँच", description: "कुछ", path: "/x" });
  expect(m.openGraph?.images).toEqual([OG_IMAGE]);
  expect(OG_IMAGE).toMatchObject({ url: "/og-image.png", width: 1200, height: 630 });
  expect(OG_IMAGE.alt).toContain("1930");
});

test("होम का structured data (JSON-LD): साइट का नाम, पता, हिंदी; संस्था का नाम; कोई सरकारी दावा नहीं", async () => {
  const { siteJsonLd } = await import("@/modules/site/meta");
  const data = siteJsonLd("https://example.org");
  const site = data.find((d) => d["@type"] === "WebSite")!;
  const org = data.find((d) => d["@type"] === "Organization")!;
  expect(site).toMatchObject({ "@context": "https://schema.org", name: "ठगी रक्षक", url: "https://example.org/", inLanguage: "hi" });
  expect(org).toMatchObject({ name: "ठगी रक्षक", url: "https://example.org/" });
  expect(JSON.stringify(data)).not.toMatch(/GovernmentOrganization|सरकार|Government/);
});
