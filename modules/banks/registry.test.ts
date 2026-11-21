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

// ---- TR-9b: जाँच 1 (Claude) के नतीजे ----
import { readFileSync } from "node:fs";
import path from "node:path";

const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const srcText = (slug: string) => norm(readFileSync(path.resolve(__dirname, "../../docs/sources/banks", `${slug}.txt`), "utf8"));

test("9 बैंकों की website Claude ने जाँची (BOI बाकी), अभी कोई live नहीं", () => {
  const checked = BANKS.filter((b) => b.officialSite?.verifiedBy.includes("claude")).map((b) => b.slug);
  expect(checked).toEqual(["sbi", "hdfc", "icici", "pnb", "bob", "canara", "union", "axis", "kotak"]);
  expect(getBank("boi")?.officialSite).toBeNull();
  expect(BANKS.filter((b) => liveSite(b) || liveChannels(b).length > 0)).toEqual([]);
});

test("हर channel की मूल लाइन docs/sources/banks में जस की तस", () => {
  for (const b of BANKS)
    for (const c of b.channels) expect(srcText(b.slug), `${b.slug} ${c.value}`).toContain(norm(c.sourceQuote));
});

test("हर tel नंबर अपनी मूल लाइन में मौजूद (अंकों से मिलाकर)", () => {
  const digits = (s: string) => s.replace(/\D/g, "");
  for (const b of BANKS)
    for (const c of b.channels.filter((x) => x.kind === "tel")) {
      expect(c.value).toMatch(/^\d{8,11}$/);
      expect(digits(c.sourceQuote), `${b.slug} ${c.value}`).toContain(c.value);
    }
});

test("web channel: बैंक का .bank.in होम पेज", () => {
  for (const b of BANKS)
    for (const c of b.channels.filter((x) => x.kind === "web")) expect(new URL(c.value).hostname.endsWith(".bank.in")).toBe(true);
});

test("ठगी के लिए अलग नंबर: HDFC, BoB, Union, ICICI", () => {
  const tel = (slug: string) => getBank(slug)!.channels.filter((c) => c.kind === "tel").map((c) => c.value);
  expect(tel("hdfc")).toEqual(["18002586161"]);
  expect(tel("bob")).toEqual(["18005700", "18005000"]);
  expect(tel("union")).toEqual(["1800222244", "1800222243"]);
  expect(tel("icici")).toEqual(["18001080"]);
  expect(tel("sbi")).toEqual([]);
});
