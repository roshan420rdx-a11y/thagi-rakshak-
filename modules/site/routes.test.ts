import { expect, test } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { absoluteUrl, publicRoutes } from "@/modules/site";

test("51 public रास्ते, कोई दोहराव नहीं, कोई API नहीं", () => {
  const r = publicRoutes();
  expect(r).toHaveLength(51);
  expect(new Set(r).size).toBe(51);
  expect(r.some((x) => x.startsWith("/api") || x === "/sw.js")).toBe(false);
  for (const must of ["/", "/turant/sextortion", "/gyan/apk-file", "/gyan/bank/hdfc", "/haq/thagi", "/legal/shikayat", "/bharosa", "/pucho"]) expect(r).toContain(must);
});

test("absoluteUrl: आख़िर वाले / से दोहरा // नहीं", () => {
  expect(absoluteUrl("/gyan", "https://x.in/")).toBe("https://x.in/gyan");
  expect(absoluteUrl("/", "https://x.in")).toBe("https://x.in/");
});

test("sitemap: हर रास्ते का पूरा URL", () => {
  const urls = sitemap().map((e) => e.url);
  expect(urls).toHaveLength(51);
  expect(urls.every((u) => /^https?:\/\//.test(u))).toBe(true);
});

test("robots: सब allow, sitemap का पता", () => {
  const r = robots();
  expect(r.rules).toMatchObject({ userAgent: "*", allow: "/" });
  expect(String(r.sitemap)).toMatch(/\/sitemap\.xml$/);
});
