import { expect, test } from "vitest";
import { buildLetter, LETTER_KINDS, type LetterInput } from "@/modules/arzi";
import { emptyCase } from "@/modules/case";
import { FORBIDDEN_PHRASES, findForbidden } from "@/modules/i18n";

const TODAY = "2026-11-22";
function input(): LetterInput {
  const c = emptyCase();
  c.txnDate = "2026-11-20";
  c.amount = 40000;
  c.stages.call_1930 = { on: "2026-11-20", number: "31611230012345" };
  c.stages.bank = { on: "2026-11-21", number: "BNK-778" };
  return {
    case: c,
    name: "राम कुमार",
    address: "गाँव सीतापुर, ज़िला बाराबंकी",
    mobile: "",
    bankName: "भारतीय स्टेट बैंक",
    branch: "",
    accountLast4: "4321",
    utr: "412345678901",
    suspect: "9XXXXXXXX0, abc@ybl",
    station: "",
    what: "एक व्यक्ति ने बैंक कर्मचारी बनकर call किया और OTP ले लिया।",
    how: "",
  };
}

test("तीन तरह के पत्र, तय क्रम", () => expect(LETTER_KINDS.map((k) => k.id)).toEqual(["bank", "police", "ombudsman"]));

test("बैंक का पत्र: तारीख़ें हिंदी में, रकम, UTR, 1930 नंबर, आख़िरी 4 अंक, नाम; ख़ाली शाखा पर [ ]", () => {
  const t = buildLetter("bank", input(), TODAY).join("\n");
  for (const must of ["20 नवंबर 2026", "₹40,000", "412345678901", "31611230012345", "4321", "राम कुमार", "भारतीय स्टेट बैंक", "[शाखा का नाम]"]) expect(t).toContain(must);
});

test("पुलिस का पत्र: ठग की जानकारी, क्या हुआ, बैंक की शिकायत का नंबर, पावती की माँग", () => {
  const t = buildLetter("police", input(), TODAY).join("\n");
  for (const must of ["9XXXXXXXX0, abc@ybl", "बैंक कर्मचारी बनकर", "BNK-778", "पावती"]) expect(t).toContain(must);
});

test("RBI Ombudsman का text: बैंक वाली शिकायत की तारीख़ और नंबर, और क्या चाहिए", () => {
  const t = buildLetter("ombudsman", input(), TODAY).join("\n");
  for (const must of ["21 नवंबर 2026", "BNK-778", "भारतीय स्टेट बैंक"]) expect(t).toContain(must);
});

test("कोई क़ानूनी धारा, OTP/PIN माँगना या मना किया शब्द नहीं; ख़ाली case पर भी पत्र बने ([ ] के साथ)", () => {
  for (const k of LETTER_KINDS) {
    const t = buildLetter(k.id, input(), TODAY).join("\n");
    expect(t).not.toMatch(/धारा|section \d|IPC|BNS\b/i);
    expect(findForbidden(t, FORBIDDEN_PHRASES)).toEqual([]);
    const blank = buildLetter(k.id, { ...input(), case: emptyCase(), name: "", bankName: "", utr: "" }, TODAY).join("\n");
    expect(blank).toContain("[");
  }
});

test("पैसे कैसे गए: कुछ न चुना हो तो [ ] में दोनों विकल्प (दोनों बातें एक साथ नहीं छपतीं)", () => {
  const t = buildLetter("bank", input(), TODAY).join("\n");
  expect(t).toContain("[ठगी से हुआ / मैंने नहीं किया: एक चुनें]");
  expect(t).not.toContain("जो ठगी से हुआ है / जो मैंने नहीं किया");
});

test("पैसे कैसे गए: 'मैंने नहीं किया' → बिना अनुमति की बात, तीनों पत्रों में", () => {
  for (const k of LETTER_KINDS) {
    const t = buildLetter(k.id, { ...input(), how: "unauthorised" }, TODAY).join("\n");
    expect(t, k.id).toContain("न मैंने किया, न उसकी अनुमति दी");
    expect(t, k.id).not.toContain("एक चुनें");
  }
});

test("पैसे कैसे गए: 'धोखे से' → ठगों ने धोखे से लेन-देन करवाया, तीनों पत्रों में", () => {
  for (const k of LETTER_KINDS) {
    const t = buildLetter(k.id, { ...input(), how: "deceived" }, TODAY).join("\n");
    expect(t, k.id).toContain("धोखे से");
    expect(t, k.id).not.toContain("न मैंने किया, न उसकी अनुमति दी");
    expect(t, k.id).not.toContain("एक चुनें");
  }
});

test("ठगी का समय तीनों पत्रों में: \"लगभग शाम 4:30 बजे (16:30)\"", () => {
  const i = input();
  i.case.txnTime = "16:30";
  for (const k of LETTER_KINDS) {
    const t = buildLetter(k.id, i, TODAY).join("\n");
    expect(t, k.id).toContain("20 नवंबर 2026 को लगभग शाम 4:30 बजे");
    expect(t, k.id).not.toContain("[लगभग समय]");
  }
  expect(buildLetter("bank", i, TODAY).join("\n")).toContain("ठगी की तारीख़ और समय: 20 नवंबर 2026, लगभग शाम 4:30 बजे (16:30)");
});

test("समय न भरा हो: तथ्यों में हाथ से भरने की जगह [लगभग समय], वाक्य में कोई ख़ाली कोष्ठक नहीं", () => {
  const i = input();
  for (const k of ["bank", "police"] as const) {
    const t = buildLetter(k, i, TODAY).join("\n");
    expect(t, k).toContain("ठगी की तारीख़ और समय: 20 नवंबर 2026, [लगभग समय]");
    expect(t, k).not.toMatch(/को लगभग \[/);
  }
  expect(buildLetter("ombudsman", i, TODAY).join("\n")).toContain("20 नवंबर 2026 को मेरे खाते");
});

const DEVANAGARI = /[\u0900-\u097F]/;
function englishInput(): LetterInput {
  const i = input();
  return { ...i, name: "Ram Kumar", address: "Sitapur village, Barabanki", mobile: "98XXXXXX10", bankName: "State Bank of India", branch: "Hazratganj", what: "A man called pretending to be from the bank and took my OTP.", how: "deceived" };
}

test("English पत्र: तीनों में वही तथ्य, और सब खाने English में हों तो एक भी हिंदी अक्षर नहीं (कुछ अनुवाद से छूटा नहीं)", () => {
  const i = englishInput();
  i.case.txnTime = "16:30";
  for (const k of LETTER_KINDS) {
    const t = buildLetter(k.id, i, TODAY, "en").join("\n");
    expect(t, k.id).not.toMatch(DEVANAGARI);
    expect(findForbidden(t, FORBIDDEN_PHRASES), k.id).toEqual([]);
    for (const must of ["20 November 2026 around 4:30 PM (16:30)", "₹40,000", "4321", "412345678901", "31611230012345"]) expect(t, `${k.id}: ${must}`).toContain(must);
  }
  const bank = buildLetter("bank", i, TODAY, "en").join("\n");
  for (const must of ["The Branch Manager", "State Bank of India, Hazratganj", "Ram Kumar", "Date: 22 November 2026", "acknowledgement", "RBI"]) expect(bank).toContain(must);
  const police = buildLetter("police", i, TODAY, "en").join("\n");
  for (const must of ["Cyber Cell", "9XXXXXXXX0, abc@ybl", "FIR", "BNK-778"]) expect(police).toContain(must);
  const omb = buildLetter("ombudsman", i, TODAY, "en").join("\n");
  for (const must of ["Complaint to the bank: 21 November 2026", "BNK-778", "compensation"]) expect(omb).toContain(must);
});

test("English पत्र: ख़ाली खानों पर English वाली [ ] जगहें, और 'पैसे कैसे गए' न चुना हो तो चुनने की जगह", () => {
  const c = emptyCase();
  const blank: LetterInput = { case: c, name: "", address: "", mobile: "", bankName: "", branch: "", accountLast4: "", utr: "", suspect: "", station: "", what: "", how: "" };
  const t = buildLetter("bank", blank, TODAY, "en").join("\n");
  for (const must of ["[date]", "[approximate time]", "[amount]", "[bank name]", "[branch name]", "[UTR number]", "[your name]", "choose one"]) expect(t).toContain(must);
  expect(t).not.toMatch(DEVANAGARI);
  expect(buildLetter("police", blank, TODAY, "en").join("\n")).not.toMatch(DEVANAGARI);
  expect(buildLetter("ombudsman", blank, TODAY, "en").join("\n")).not.toMatch(DEVANAGARI);
});

test("भाषा न दें तो हिंदी (पहले जैसा)", () => {
  expect(buildLetter("bank", input(), TODAY)).toEqual(buildLetter("bank", input(), TODAY, "hi"));
});

test("पुलिस वाला पत्र: थाने/cyber cell का नाम भरें तो पत्र में, ख़ाली हो तो [ ] जगह (हिंदी और English)", () => {
  const i = input();
  expect(buildLetter("police", i, TODAY).join("\n")).toContain("[थाने / cyber cell का नाम और ज़िला]");
  expect(buildLetter("police", i, TODAY, "en").join("\n")).toContain("[name of the police station / cyber cell, and district]");
  i.station = "थाना कोतवाली, ज़िला बाराबंकी";
  const hi = buildLetter("police", i, TODAY);
  expect(hi[2]).toBe("थाना कोतवाली, ज़िला बाराबंकी");
  i.station = "Cyber Cell, Lucknow";
  expect(buildLetter("police", i, TODAY, "en")[2]).toBe("Cyber Cell, Lucknow");
});

test("सुनने के लिए पत्र: [ ] वाली जगहें 'ख़ाली जगह' कहकर पढ़ी जाएँ, कोष्ठक न बोले जाएँ", async () => {
  const { speakableLetter } = await import("@/modules/arzi");
  expect(speakableLetter("प्रति,\n[बैंक का नाम], [शाखा का नाम]")).toBe("प्रति,\nख़ाली जगह: बैंक का नाम।, ख़ाली जगह: शाखा का नाम।");
  expect(speakableLetter("रकम: ₹500")).toBe("रकम: ₹500");
  const t = speakableLetter(buildLetter("bank", { ...input(), branch: "", utr: "" }, TODAY).join("\n"));
  expect(t).not.toMatch(/[[\]]/);
  expect(t).toContain("ख़ाली जगह: शाखा का नाम");
});
