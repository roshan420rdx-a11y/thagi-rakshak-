import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";
import { BANK_TIPS } from "@/modules/banks";

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

test("6 सुझाव, तय क्रम", () =>
  expect(BANK_TIPS.map((t) => t.id)).toEqual(["bank_in", "card_back", "home_link", "channels_24x7", "sms_reply", "ack"]));

test("card_back का स्रोत नहीं (आम समझ), बाकी के RBI quote मूल फ़ाइल में जस के तस", () => {
  for (const tip of BANK_TIPS) {
    if (tip.id === "card_back") {
      expect(tip.source).toBeNull();
      continue;
    }
    expect(tip.source).not.toBeNull();
    const text = readFileSync(path.resolve(__dirname, "../..", tip.source!.file), "utf8");
    expect(norm(text), tip.id).toContain(norm(tip.source!.quote));
  }
});

test("bank_in सुझाव में .bank.in और 31 अक्टूबर 2025", () => {
  const t = BANK_TIPS.find((x) => x.id === "bank_in")!.textHi;
  expect(t).toContain('".bank.in"');
  expect(t).toContain("31 अक्टूबर 2025");
});
