import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";
import { FORBIDDEN_PHRASES, findForbidden } from "@/modules/i18n";
import { HELPLINES, HELP_SITES } from "@/modules/site/helplines";

const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const read = (f: string) => norm(readFileSync(path.resolve(__dirname, "../..", f), "utf8"));

test("ज़रूरी नंबर: 1930 सबसे पहले, फिर 112, 181, 14416, 14448, 1947; सब अलग, सिर्फ़ अंक", () => {
  expect(HELPLINES.map((h) => h.number)).toEqual(["1930", "112", "181", "14416", "14448", "1947"]);
  for (const h of HELPLINES) expect(h.number).toMatch(/^\d{3,5}$/);
});

test("हर नंबर का मूल स्रोत: उद्धरण saved file में जस का तस, नंबर उसी उद्धरण में; जो जाँचा नहीं गया वह साफ़ लिखा", () => {
  for (const h of HELPLINES) {
    if (h.source) {
      expect(read(h.source.file), h.number).toContain(norm(h.source.quote));
      expect(h.source.quote, h.number).toContain(h.number);
    } else {
      expect(h.unverifiedHi, h.number).toBeTruthy();
    }
  }
  // अभी सिर्फ़ Tele-MANAS बिना मिलान के (उसकी साइट इस environment से नहीं खुली)
  expect(HELPLINES.filter((h) => !h.source).map((h) => h.number)).toEqual(["14416"]);
});

test("ज़रूरी साइटें: सिर्फ़ जाँचे हुए सरकारी portal", () => {
  expect(HELP_SITES.map((s) => s.href)).toEqual(["https://cybercrime.gov.in", "https://sancharsaathi.gov.in", "https://cms.rbi.org.in"]);
});

test("कोई मना किया शब्द नहीं", () => {
  const copy = [...HELPLINES.flatMap((h) => [h.titleHi, h.whenHi]), ...HELP_SITES.flatMap((s) => [s.labelHi, s.whenHi])].join("\n");
  expect(findForbidden(copy, FORBIDDEN_PHRASES)).toEqual([]);
});
