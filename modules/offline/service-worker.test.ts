import { expect, test } from "vitest";
import { OFFLINE_URLS, buildServiceWorker, extractNextAssets, swVersion } from "@/modules/offline";

test("OFFLINE_URLS: /turant, 10 पन्ने और /gyan/bank", () => {
  expect(OFFLINE_URLS).toContain("/turant");
  expect(OFFLINE_URLS).toContain("/turant/digital-arrest");
  expect(OFFLINE_URLS).toContain("/gyan/bank");
  expect(OFFLINE_URLS).toHaveLength(12);
});

test("worker में version और हर URL", () => {
  const js = buildServiceWorker({ version: "turant-2026-11-21.1", urls: OFFLINE_URLS });
  expect(js).toContain('"turant-2026-11-21.1"');
  for (const u of OFFLINE_URLS) expect(js).toContain(JSON.stringify(u));
});

test("worker JS के रूप में parse होता है", () => {
  expect(() => new Function(buildServiceWorker({ version: "v", urls: ["/turant"] }))).not.toThrow();
});

test("extractNextAssets: script/link और flight data से /_next/static files", () => {
  const html = [
    '<link rel="stylesheet" href="/_next/static/css/abc123.css" data-precedence="next"/>',
    '<script src="/_next/static/chunks/webpack-1.js" async=""></script>',
    '<script>self.__next_f.push([1,"3:I[\\"123\\",[\\"static/chunks/app/(site)/gyan/bank/page-f01.js\\"],\\"default\\"]"])</script>',
    '<script src="/_next/static/chunks/webpack-1.js" async=""></script>',
    '<a href="/gyan/bank/sbi">x</a>',
  ].join("");
  expect(extractNextAssets(html).sort()).toEqual([
    "/_next/static/chunks/app/(site)/gyan/bank/page-f01.js",
    "/_next/static/chunks/webpack-1.js",
    "/_next/static/css/abc123.css",
  ]);
});

test("worker install में हर पन्ने की static files भी cache होती हैं", () => {
  const js = buildServiceWorker({ version: "v", urls: ["/turant"] });
  expect(js).toContain("function extractNextAssets(html)");
  expect(() => new Function(js)).not.toThrow();
});

test("swVersion: content version + commit के 7 अक्षर", () => {
  expect(swVersion({ RENDER_GIT_COMMIT: "abcdef123456" })).toBe("turant-2026-11-21.2-abcdef1");
  expect(swVersion({ GITHUB_SHA: "9999999aaaa" })).toBe("turant-2026-11-21.2-9999999");
  expect(swVersion({})).toBe("turant-2026-11-21.2-local");
});
