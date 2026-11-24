import { expect, test } from "vitest";
import { buildCsp, buildSecurityHeaders } from "@/modules/security";

test("CSP बाहर की script, frame और plugin रोकता है", () => {
  const csp = buildCsp({ production: true });
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("worker-src 'self'");
  expect(csp).not.toMatch(/'unsafe-eval'/); // आम eval नहीं ('wasm-unsafe-eval' सिर्फ़ WebAssembly के लिए, नीचे वाला test)
});

test("development में hot-reload के लिए eval की छूट", () => {
  expect(buildCsp({ production: false })).toContain("'unsafe-eval'");
});

test("HSTS सिर्फ़ production में", () => {
  const has = (p: boolean) => buildSecurityHeaders({ production: p }).some((h) => h.key === "Strict-Transport-Security");
  expect(has(true)).toBe(true);
  expect(has(false)).toBe(false);
});

test("camera, location, payment बंद; mic सिर्फ़ अपनी साइट के लिए (\"बोलकर लिखें\"), किसी और को नहीं", () => {
  const pp = buildSecurityHeaders({ production: true }).find((h) => h.key === "Permissions-Policy")!.value;
  for (const f of ["camera=()", "microphone=(self)", "geolocation=()", "payment=()"]) expect(pp).toContain(f);
  expect(pp).not.toContain("microphone=()");
  expect(pp).not.toContain("microphone=*");
});

test("photo से जाँच (फ़ोन के अंदर OCR) के लिए WebAssembly: 'wasm-unsafe-eval' हाँ, 'unsafe-eval' production में नहीं", () => {
  const csp = buildCsp({ production: true });
  const script = csp.split("; ").find((d) => d.startsWith("script-src "))!;
  expect(script).toContain("'wasm-unsafe-eval'");
  expect(script).not.toMatch(/'unsafe-eval'/);
  expect(csp).toContain("worker-src 'self'");
  expect(csp).not.toMatch(/worker-src[^;]*blob:/);
});
