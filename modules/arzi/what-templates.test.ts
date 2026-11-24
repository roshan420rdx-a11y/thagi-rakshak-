import { expect, test } from "vitest";
import { HOW_OPTIONS } from "@/modules/arzi";
import { WHAT_MAX, WHAT_TEMPLATES, applyWhatTemplate } from "@/modules/arzi/what-templates";
import { FORBIDDEN_PHRASES, findForbidden } from "@/modules/i18n";

test("नमूने: अलग id, छोटा नाम, पहले पुरुष में (मैं/मेरे/मुझे), भरने की [ ] जगह, हद के अंदर, कोई वादा नहीं", () => {
  expect(WHAT_TEMPLATES.length).toBeGreaterThanOrEqual(8);
  expect(new Set(WHAT_TEMPLATES.map((t) => t.id)).size).toBe(WHAT_TEMPLATES.length);
  const hows = HOW_OPTIONS.map((o) => o.id);
  for (const t of WHAT_TEMPLATES) {
    expect(t.labelHi.length, t.id).toBeLessThanOrEqual(45);
    expect(t.textHi, t.id).toMatch(/मैं|मेरे|मुझे|मैंने|मुझसे/);
    expect(t.textHi, t.id).toMatch(/\[[^\]]+\]/);
    expect(t.textHi.length, t.id).toBeLessThanOrEqual(WHAT_MAX);
    expect(findForbidden(`${t.labelHi} ${t.textHi}`, FORBIDDEN_PHRASES), t.id).toEqual([]);
    expect(hows, t.id).toContain(t.how);
  }
});

test("सिर्फ़ 'मैंने कुछ नहीं किया' वाला नमूना 'बिना अनुमति' है, बाकी सब 'धोखे से'", () => {
  const un = WHAT_TEMPLATES.filter((t) => t.how === "unauthorised").map((t) => t.id);
  expect(un).toEqual(["nothing_done"]);
});

test("applyWhatTemplate: ख़ाली या बिना बदला नमूना हो तो बदल दे; अपना लिखा हो तो मिटाए नहीं, नीचे जोड़े; हद से लंबा नहीं", () => {
  const [a, b] = WHAT_TEMPLATES;
  expect(applyWhatTemplate("", a)).toBe(a.textHi);
  expect(applyWhatTemplate("  \n", a)).toBe(a.textHi);
  expect(applyWhatTemplate(a.textHi, b)).toBe(b.textHi);
  expect(applyWhatTemplate("मेरी अपनी बात", b)).toBe(`मेरी अपनी बात\n${b.textHi}`);
  expect(applyWhatTemplate("क".repeat(WHAT_MAX), b).length).toBe(WHAT_MAX);
});
