import { expect, test } from "vitest";
import { TELE_MANAS, TURANT_CONTENT_VERSION, TURANT_SLUGS, getTurantPage, isTurantSlug, type TurantAction } from "@/modules/scams";

test("10 slug, सब अलग", () => {
  expect(TURANT_SLUGS).toHaveLength(10);
  expect(new Set(TURANT_SLUGS).size).toBe(10);
});

test.each(TURANT_SLUGS)("%s: शीर्षक और कम से कम 3 कदम", (s) => {
  const p = getTurantPage(s);
  expect(p.slug).toBe(s);
  expect(p.titleHi.length).toBeGreaterThan(3);
  expect(p.steps.length).toBeGreaterThanOrEqual(3);
  expect(p.uploadAllowed).toBe(false);
});

test.each(TURANT_SLUGS)("%s: 1930 कहीं न कहीं है", (s) => {
  const acts = getTurantPage(s).steps.flatMap((st) => st.actions);
  expect(acts.some((a) => a.kind === "tel" && a.number === "1930")).toBe(true);
});

test("digital-arrest पर danger banner", () =>
  expect(getTurantPage("digital-arrest").banner).toEqual({
    tone: "danger",
    textHi: "कोई पुलिस, CBI या कोर्ट video call पर गिरफ़्तार नहीं करती। call काटिए। पैसे न भेजें।",
  }));

test("sextortion: Tele-MANAS हाँ, upload नहीं, पहला कदम पैसे न देना", () => {
  const p = getTurantPage("sextortion");
  expect(p.showTeleManas).toBe(true);
  expect(p.steps[0].id).toBe("dont_pay_threat");
  expect(p.banner).toEqual({ tone: "warn", textHi: "पैसे न दें। आप अकेले नहीं हैं, और यह आपकी गलती नहीं है।" });
  expect(TELE_MANAS).toEqual({ kind: "tel", number: "14416", labelHi: "Tele-MANAS: 14416 (मुफ़्त)" });
});

test("सिर्फ़ sextortion पर Tele-MANAS", () => {
  expect(TURANT_SLUGS.filter((s) => getTurantPage(s).showTeleManas)).toEqual(["sextortion"]);
});

test("card पर पहला कदम card block", () => expect(getTurantPage("card").steps[0].id).toBe("block_card"));

test("पन्नों के कदम तालिका के क्रम में", () => {
  const ids = (s: Parameters<typeof getTurantPage>[0]) => getTurantPage(s).steps.map((st) => st.id);
  expect(ids("upi")).toEqual(["call_1930", "tell_bank", "written_complaint", "keep_evidence"]);
  expect(ids("loan-app")).toEqual(["dont_pay_threat", "warn_contacts", "call_1930", "keep_evidence"]);
  expect(ids("investment-task")).toEqual(["stop_paying", "call_1930", "tell_bank", "written_complaint", "keep_evidence"]);
  expect(ids("customer-care-fake")).toEqual(["remove_app", "call_1930", "tell_bank", "written_complaint", "keep_evidence"]);
});

test("call_1930 का text spec से जस का तस", () => {
  const st = getTurantPage("upi").steps[0];
  expect(st).toEqual({
    id: "call_1930",
    titleHi: "1930 पर call करें",
    urgencyHi: "पहले 30 मिनट सबसे कीमती",
    bodyHi: "लाइन न लगे तो रुकें नहीं, नीचे वाले link से online शिकायत करें।",
    actions: [
      { kind: "tel", number: "1930", labelHi: "1930 मिलाएँ" },
      { kind: "link", href: "https://cybercrime.gov.in", labelHi: "cybercrime.gov.in पर शिकायत", external: true },
    ],
  });
});

test("बैंक वाले कदम पर Google की चेतावनी", () => {
  expect(getTurantPage("upi").steps[1].warningHi).toBe("नंबर Google पर न खोजें। नकली \"customer care\" नंबर ठगी का बड़ा जाल हैं।");
});

test("हर बाहरी link https://cybercrime.gov.in", () => {
  const links = TURANT_SLUGS.flatMap((s) => getTurantPage(s).steps.flatMap((st) => st.actions)).filter((a): a is Extract<TurantAction, { kind: "link" }> => a.kind === "link" && a.external);
  expect(links.length).toBeGreaterThan(0);
  for (const l of links) expect(l.href).toBe("https://cybercrime.gov.in");
});

test("getTurantPage हर बार नया object (साझा data नहीं बदलता)", () => {
  const a = getTurantPage("upi");
  a.steps[0].titleHi = "बदला";
  expect(getTurantPage("upi").steps[0].titleHi).toBe("1930 पर call करें");
});

test("isTurantSlug", () => {
  expect(isTurantSlug("upi")).toBe(true);
  expect(isTurantSlug("abc")).toBe(false);
});

test("content version का रूप", () => expect(TURANT_CONTENT_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}\.\d+$/));

test("बैंक वाले कदमों पर अपने बैंक के पन्ने का (अंदर का) link", () => {
  for (const [slug, i] of [["upi", 1], ["card", 0]] as const) {
    expect(getTurantPage(slug).steps[i].actions).toContainEqual({ kind: "link", href: "/gyan/bank", labelHi: "अपने बैंक का सही रास्ता देखें", external: false });
  }
});

test("content version बदला (offline cache नया हो)", () => expect(TURANT_CONTENT_VERSION).toBe("2026-11-22.1"));
