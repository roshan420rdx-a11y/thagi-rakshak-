import { expect, test } from "vitest";
import { buildCsp, buildSecurityHeaders } from "@/modules/security";

test("CSP बाहर की script, frame और plugin रोकता है", () => {
  const csp = buildCsp({ production: true });
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("worker-src 'self'");
  expect(csp).not.toContain("unsafe-eval");
});

test("development में hot-reload के लिए eval की छूट", () => {
  expect(buildCsp({ production: false })).toContain("'unsafe-eval'");
});

test("HSTS सिर्फ़ production में", () => {
  const has = (p: boolean) => buildSecurityHeaders({ production: p }).some((h) => h.key === "Strict-Transport-Security");
  expect(has(true)).toBe(true);
  expect(has(false)).toBe(false);
});

test("camera, microphone, location, payment बंद", () => {
  const pp = buildSecurityHeaders({ production: true }).find((h) => h.key === "Permissions-Policy")!.value;
  for (const f of ["camera=()", "microphone=()", "geolocation=()", "payment=()"]) expect(pp).toContain(f);
});
