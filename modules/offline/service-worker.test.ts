import { expect, test } from "vitest";
import { OFFLINE_URLS, buildServiceWorker } from "@/modules/offline";

test("OFFLINE_URLS: /turant और 10 पन्ने", () => {
  expect(OFFLINE_URLS).toContain("/turant");
  expect(OFFLINE_URLS).toContain("/turant/digital-arrest");
  expect(OFFLINE_URLS).toHaveLength(11);
});

test("worker में version और हर URL", () => {
  const js = buildServiceWorker({ version: "turant-2026-11-21.1", urls: OFFLINE_URLS });
  expect(js).toContain('"turant-2026-11-21.1"');
  for (const u of OFFLINE_URLS) expect(js).toContain(JSON.stringify(u));
});

test("worker JS के रूप में parse होता है", () => {
  expect(() => new Function(buildServiceWorker({ version: "v", urls: ["/turant"] }))).not.toThrow();
});
