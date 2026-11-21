import { expect, test } from "vitest";
import { CONTRAST_PAIRS, TOKENS, contrastRatio } from "@/modules/design";

test("काला-सफ़ेद = 21", () => expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1));
test("#777777 सफ़ेद पर ≈ 4.48", () => expect(contrastRatio("#777777", "#FFFFFF")).toBeCloseTo(4.48, 2));
test("क्रम से फ़र्क नहीं", () =>
  expect(contrastRatio("#FFFFFF", "#B42318")).toBeCloseTo(contrastRatio("#B42318", "#FFFFFF"), 5));

test.each(["light", "dark"] as const)("%s: हर जोड़ा अपनी न्यूनतम सीमा पार करे", (mode) => {
  for (const p of CONTRAST_PAIRS) {
    expect.soft(contrastRatio(TOKENS[mode][p.fg], TOKENS[mode][p.bg]), `${mode} ${p.fg}/${p.bg}`).toBeGreaterThanOrEqual(p.min);
  }
});

test("light मान spec से जस के तस", () => {
  expect(TOKENS.light).toMatchObject({
    brand: "#1D3A6B",
    "brand-bg": "#EEF2F8",
    danger: "#B42318",
    "danger-bg": "#FEF3F2",
    warn: "#B54708",
    "warn-bg": "#FFFAEB",
    safe: "#067647",
    "safe-bg": "#ECFDF3",
    ink: "#101828",
    muted: "#475467",
    line: "#E4E7EC",
    paper: "#FFFFFF",
    surface: "#F7F6F3",
    "on-danger": "#FFFFFF",
    "on-safe": "#FFFFFF",
  });
});

test("CONTRAST_PAIRS में spec के 12 जोड़े", () => {
  expect(CONTRAST_PAIRS.map((p) => `${p.fg}/${p.bg}`)).toEqual([
    "ink/paper", "ink/surface", "muted/paper", "muted/surface", "brand/paper", "brand/brand-bg",
    "danger/paper", "danger/danger-bg", "on-danger/danger", "warn/warn-bg", "safe/safe-bg", "on-safe/safe",
  ]);
  for (const p of CONTRAST_PAIRS) expect(p.min).toBe(4.5);
});
