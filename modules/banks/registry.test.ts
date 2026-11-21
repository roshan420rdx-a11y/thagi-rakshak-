import { expect, test } from "vitest";
import { BANKS, getBank, isLive, liveChannels, liveSite, type BankEntry } from "@/modules/banks";

test("10 बैंक, slug अलग, क्रम spec जैसा", () => {
  expect(BANKS.map((b) => b.slug)).toEqual(["sbi", "hdfc", "icici", "pnb", "bob", "canara", "union", "axis", "kotak", "boi"]);
});

test("isLive: दोनों जाँच ज़रूरी", () => {
  expect(isLive({ verifiedBy: ["claude"], verifiedOn: "2026-11-21" })).toBe(false);
  expect(isLive({ verifiedBy: ["owner"], verifiedOn: "2026-11-21" })).toBe(false);
  expect(isLive({ verifiedBy: ["claude", "owner"], verifiedOn: "2026-11-21" })).toBe(true);
});

test("हर website का पता https और .bank.in पर", () => {
  for (const b of BANKS) {
    if (!b.officialSite) continue;
    const u = new URL(b.officialSite.url);
    expect(u.protocol).toBe("https:");
    expect(u.hostname.endsWith(".bank.in")).toBe(true);
  }
});

test("हर channel का स्रोत .bank.in वाली साइट और मूल लाइन", () => {
  for (const b of BANKS)
    for (const c of b.channels) {
      expect(new URL(c.sourceUrl).hostname.endsWith(".bank.in")).toBe(true);
      expect(c.sourceQuote.length).toBeGreaterThan(10);
    }
});

const sample: BankEntry = {
  slug: "t",
  nameHi: "t",
  nameEn: "t",
  officialSite: { url: "https://t.bank.in/", verifiedBy: ["claude"], verifiedOn: "2026-11-21" },
  channels: [{ kind: "tel", value: "1800", labelHi: "x", sourceUrl: "https://t.bank.in/x", sourceQuote: "xxxxxxxxxxxx", verifiedBy: ["claude"], verifiedOn: "2026-11-21" }],
};

test("liveChannels / liveSite सिर्फ़ दो-जाँच वाले", () => {
  expect(liveChannels(sample)).toEqual([]);
  expect(liveSite(sample)).toBeNull();
  const both = { verifiedBy: ["claude", "owner"], verifiedOn: "2026-11-21" };
  expect(liveChannels({ ...sample, channels: [{ ...sample.channels[0], ...both }] })).toHaveLength(1);
  expect(liveSite({ ...sample, officialSite: { url: "https://t.bank.in/", ...both } })).toBe("https://t.bank.in/");
});

test("getBank", () => {
  expect(getBank("sbi")?.nameEn).toBe("State Bank of India");
  expect(getBank("xyz")).toBeUndefined();
});
