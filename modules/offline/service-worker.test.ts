import { expect, test } from "vitest";
import { OFFLINE_URLS, buildServiceWorker, extractNextAssets, swVersion } from "@/modules/offline";

test("OFFLINE_URLS: /turant, 10 पन्ने, /gyan/bank और /pucho (जाँच फ़ोन में होती है, internet के बिना भी)", () => {
  expect(OFFLINE_URLS).toContain("/turant");
  expect(OFFLINE_URLS).toContain("/turant/digital-arrest");
  expect(OFFLINE_URLS).toContain("/gyan/bank");
  expect(OFFLINE_URLS).toContain("/pucho");
  expect(OFFLINE_URLS).toContain("/shikayat-rasta");
  expect(OFFLINE_URLS).toContain("/case");
  expect(OFFLINE_URLS).toContain("/arzi");
  expect(OFFLINE_URLS).toContain("/abhyas");
  expect(OFFLINE_URLS).toContain("/nambar");
  expect(OFFLINE_URLS).toContain("/khoj"); // खोज भी फ़ोन के अंदर होती है
  expect(OFFLINE_URLS).toHaveLength(20);
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
  expect(swVersion({ RENDER_GIT_COMMIT: "abcdef123456" })).toBe("turant-2026-11-23.3-abcdef1");
  expect(swVersion({ GITHUB_SHA: "9999999aaaa" })).toBe("turant-2026-11-23.3-9999999");
  expect(swVersion({})).toBe("turant-2026-11-23.3-local");
});

test("worker: Share वाला POST (/pucho/share) फ़ोन के अंदर ही, अलग डिब्बे में; activate उस डिब्बे को न मिटाए", async () => {
  const { SHARE_CACHE, SHARE_PATH } = await import("@/modules/checker/share-inbox");
  const sw = buildServiceWorker({ version: "v-test", urls: ["/turant"] });
  expect(sw).toContain(JSON.stringify(SHARE_PATH));
  expect(sw).toContain(JSON.stringify(SHARE_CACHE));
  expect(sw).toMatch(/req\.method === "POST"/);
  expect(sw).toMatch(/formData\(\)/);
  expect(sw).toMatch(/k !== VERSION && k !== SHARE_CACHE/);
  expect(() => new Function(sw)).not.toThrow();
});

test("worker का combineShared और फ़ोन वाला combineShared एक जैसा जवाब दें", async () => {
  const { combineShared } = await import("@/modules/checker/share-inbox");
  const sw = buildServiceWorker({ version: "v-test", urls: [] });
  const fromSw = new Function(`${sw.replace(/self\.addEventListener[\s\S]*$/, "")}; return combineShared;`)() as typeof combineShared;
  const cases: [unknown, unknown, unknown][] = [["", "OTP बताइए", ""], ["SBI", "KYC update करें", "http://x.top"], [null, "यहाँ खोलें http://x.top", "http://x.top"], [undefined, "  ", undefined]];
  for (const [a, b, c] of cases) expect(fromSw(a, b, c)).toBe(combineShared(a, b, c));
});

test("worker: Share से आई photo भी फ़ोन के अंदर, उसी अलग डिब्बे में (अपनी key पर), हद के साथ", async () => {
  const { MAX_SHARE_IMAGE_BYTES, SHARE_IMAGE_KEY } = await import("@/modules/checker/share-inbox");
  const sw = buildServiceWorker({ version: "v-test", urls: [] });
  expect(sw).toContain(JSON.stringify(SHARE_IMAGE_KEY));
  expect(sw).toContain(`const SHARE_IMAGE_MAX = ${MAX_SHARE_IMAGE_BYTES};`);
  expect(sw).toMatch(/form\.getAll\("image"\)/);
  expect(() => new Function(sw)).not.toThrow();
});

test("worker का pickSharedImage और फ़ोन वाला pickSharedImage एक जैसा जवाब दें", async () => {
  const { pickSharedImage } = await import("@/modules/checker/share-inbox");
  const sw = buildServiceWorker({ version: "v-test", urls: [] });
  const fromSw = new Function(`${sw.replace(/self\.addEventListener[\s\S]*$/, "")}; return pickSharedImage;`)() as typeof pickSharedImage;
  const png = new Blob(["x"], { type: "image/png" });
  const big = new Blob(["x".repeat(50)], { type: "image/jpeg" });
  const cases: unknown[][] = [[png], ["t", png], [new Blob([], { type: "image/png" })], [new Blob(["a"], { type: "text/plain" })], [big, png], [null, {}], []];
  for (const c of cases) expect(fromSw(c, 10)).toBe(pickSharedImage(c, 10));
});

test("worker: photo से जाँच की files (/ocr) एक बार आने के बाद फ़ोन में (offline भी); डिब्बे का नाम OCR के version से", async () => {
  const { OCR_CACHE } = await import("./service-worker");
  const { readFileSync } = await import("node:fs");
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const core = JSON.parse(readFileSync("node_modules/tesseract.js-core/package.json", "utf8"));
  // tesseract या भाषा की files बदलें तो डिब्बे का नाम भी बदले (वरना पुरानी files चलती रहें)
  for (const v of [pkg.dependencies["tesseract.js"], core.version, pkg.dependencies["@tesseract.js-data/hin"], pkg.dependencies["@tesseract.js-data/eng"]]) expect(OCR_CACHE).toContain(v);
  const sw = buildServiceWorker({ version: "v-test", urls: [] });
  expect(sw).toContain(`const OCR_CACHE = ${JSON.stringify(OCR_CACHE)};`);
  expect(sw).toMatch(/url\.pathname\.startsWith\("\/ocr\/"\)/);
  expect(sw).toMatch(/k !== VERSION && k !== SHARE_CACHE && k !== OCR_CACHE/);
  expect(() => new Function(sw)).not.toThrow();
});
