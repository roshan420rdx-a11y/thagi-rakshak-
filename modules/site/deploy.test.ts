import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";

const root = path.resolve(__dirname, "../..");
const read = (f: string) => readFileSync(path.join(root, f), "utf8");

test("render.yaml: health check, dev dependencies के साथ build, Node 22, singapore", () => {
  const y = read("render.yaml");
  expect(y).toContain("healthCheckPath: /api/health");
  expect(y).toContain("npm ci --include=dev && npm run build");
  expect(y).toMatch(/key: NODE_VERSION\s+value: "?22"?/);
  expect(y).toContain("region: singapore");
});

test(".env.example की हर setting render.yaml में (sync: false, कोई असली मान नहीं)", () => {
  const keys = [...read(".env.example").matchAll(/^([A-Z_]+)=/gm)].map((m) => m[1]);
  expect(keys.length).toBeGreaterThanOrEqual(5);
  const y = read("render.yaml");
  for (const k of keys) expect(y, k).toMatch(new RegExp(`key: ${k}\\s+sync: false`));
});

test("uptime workflow: SITE_URL न हो तो कुछ न करे", () => {
  const w = read(".github/workflows/uptime.yml");
  expect(w).toContain("vars.SITE_URL != ''");
  expect(w).toContain("/api/health");
});
