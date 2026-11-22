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
    what: "एक व्यक्ति ने बैंक कर्मचारी बनकर call किया और OTP ले लिया।",
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
