import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";
import { FORBIDDEN_PHRASES, findForbidden } from "@/modules/i18n";
import { SHIKAYAT_STAGES } from "@/modules/shikayat";

const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const root = path.resolve(__dirname, "../..");

test("पाँच पड़ाव, सही क्रम में", () =>
  expect(SHIKAYAT_STAGES.map((s) => s.id)).toEqual(["call_1930", "ncrp", "bank", "police", "ombudsman"]));

test("हर पड़ाव में: कब, क्या करें, और सँभालने की चीज़ें", () => {
  for (const s of SHIKAYAT_STAGES) {
    expect(s.whenHi.length, s.id).toBeGreaterThan(10);
    expect(s.stepsHi.length, s.id).toBeGreaterThanOrEqual(2);
    expect(s.keepHi.length, s.id).toBeGreaterThanOrEqual(1);
  }
});

test("1930 का tel link, NCRP और RBI CMS के असली पते", () => {
  const actions = SHIKAYAT_STAGES.flatMap((s) => s.actions);
  expect(actions).toContainEqual(expect.objectContaining({ kind: "tel", number: "1930" }));
  expect(actions).toContainEqual(expect.objectContaining({ kind: "link", href: "https://cybercrime.gov.in" }));
  expect(actions).toContainEqual(expect.objectContaining({ kind: "link", href: "https://cms.rbi.org.in" }));
  expect(actions).toContainEqual(expect.objectContaining({ kind: "tel", number: "14448" }));
});

test("Ombudsman: 30 दिन, 90 दिन, मुफ़्त, मुआवज़े की सीमा, और हर बात का RBI quote मूल text में", () => {
  const o = SHIKAYAT_STAGES.find((s) => s.id === "ombudsman")!;
  const text = JSON.stringify(o);
  for (const must of ["30 दिन", "90 दिन", "मुफ़्त", "₹30 लाख", "₹3 लाख"]) expect(text).toContain(must);
  expect(o.sources.length).toBeGreaterThanOrEqual(3);
  for (const src of o.sources) {
    expect(src.url).toMatch(/^https:\/\/www\.rbi\.org\.in\//);
    expect(norm(readFileSync(path.join(root, src.file), "utf8"))).toContain(norm(src.quote));
  }
});

test("कोई वादा नहीं (मना किए शब्द नहीं), और 'पैसा वापस दिलाने वाले' से सावधानी", () => {
  const all = JSON.stringify(SHIKAYAT_STAGES);
  expect(findForbidden(all, FORBIDDEN_PHRASES)).toEqual([]);
  expect(all).toContain("पैसा वापस दिलाने");
});

test("बैंक के email का नमूना (हिंदी + English): ख़ाली जगहें, कोई OTP/PIN या पूरा खाता नंबर नहीं, कोई धारा नहीं", async () => {
  const { BANK_EMAIL_SAMPLES } = await import("@/modules/shikayat");
  expect(BANK_EMAIL_SAMPLES.map((s) => s.lang)).toEqual(["hi", "en"]);
  for (const s of BANK_EMAIL_SAMPLES) {
    expect(s.text).toContain("[UTR");
    expect(s.text).toMatch(/1930/);
    expect(s.text).not.toMatch(/\bOTP\b.*:|\bPIN\b.*:|CVV/);
    expect(s.text).not.toMatch(/धारा|section \d/i);
    expect(findForbidden(s.text, FORBIDDEN_PHRASES)).toEqual([]);
  }
});
