// मुफ़्त अर्ज़ियाँ (plan B1): बैंक, पुलिस/cyber cell, और RBI Ombudsman के लिए पत्र का text।
// सिर्फ़ तथ्य और माँग, कोई क़ानूनी धारा नहीं (DISHA: वह वकील की जाँच के बाद)। जो जानकारी नहीं, वहाँ "[ ... ]"।
// शुद्ध functions: सब फ़ोन में बनता है, कहीं भेजा नहीं जाता।
import type { LocalCase } from "@/modules/case";
import { formatHindiDate, formatHindiTime } from "@/modules/rules-engine";
import { buildLetterEn } from "./letters-en";

export type LetterKind = "bank" | "police" | "ombudsman";
// पत्र की भाषा (plan A2i): दूसरे राज्य की शाखा या थाने के लिए English
export type LetterLang = "hi" | "en";
export const LETTER_LANGS: readonly { id: LetterLang; labelHi: string; hintHi: string }[] = [
  { id: "hi", labelHi: "हिंदी", hintHi: "" },
  { id: "en", labelHi: "English", hintHi: "दूसरे राज्य की शाखा या थाने के लिए" },
];

export const LETTER_KINDS: readonly { id: LetterKind; labelHi: string; hintHi: string }[] = [
  { id: "bank", labelHi: "बैंक शाखा को शिकायत पत्र", hintHi: "शाखा में देकर पावती लें, या email करें" },
  { id: "police", labelHi: "थाने या cyber cell को शिकायत पत्र", hintHi: "दो copy ले जाएँ; एक पर पावती लें" },
  { id: "ombudsman", labelHi: "RBI Ombudsman के लिए शिकायत का text", hintHi: "cms.rbi.org.in पर शिकायत के डिब्बे में चिपकाएँ" },
];

// पैसे कैसे गए: पत्र सच्चा रहे, इसलिए पीड़ित चुने; न चुने तो [ ] ख़ाली जगह (दोनों बातें एक साथ नहीं)
export type HowMoneyWent = "" | "deceived" | "unauthorised";
export const HOW_OPTIONS: readonly { id: Exclude<HowMoneyWent, "">; labelHi: string }[] = [
  { id: "deceived", labelHi: "ठगों ने धोखे से भिजवाए, या धोखे से OTP/PIN लेकर निकाले" },
  { id: "unauthorised", labelHi: "मैंने न कोई लेन-देन किया, न OTP/PIN बताया; फिर भी कटे" },
];

function howLine(how: HowMoneyWent): string {
  if (how === "unauthorised") return "यह लेन-देन न मैंने किया, न उसकी अनुमति दी।";
  if (how === "deceived") return "यह लेन-देन ठगों ने धोखे से करवाया।";
  return "यह लेन-देन [ठगी से हुआ / मैंने नहीं किया: एक चुनें]।";
}

export type LetterInput = {
  case: LocalCase;
  name: string;
  address: string;
  mobile: string;
  bankName: string;
  branch: string;
  accountLast4: string;
  utr: string;
  suspect: string; // ठग का नंबर, UPI ID, link
  station: string; // थाने या cyber cell का नाम और ज़िला (पुलिस वाला पत्र)
  what: string; // क्या हुआ, अपने शब्दों में
  how: HowMoneyWent;
};

const or = (v: string | null | undefined, blank: string) => (v && v.trim() ? v.trim() : `[${blank}]`);
const date = (d: string | null) => (d ? formatHindiDate(d) : "[तारीख़]");
// "20 नवंबर 2026 को लगभग शाम 4:30 बजे (16:30)"; समय न हो तो सिर्फ़ "20 नवंबर 2026 को"
const on = (c: LocalCase) => `${date(c.txnDate)} को${c.txnTime ? ` लगभग ${formatHindiTime(c.txnTime)}` : ""}`;
const rupees = (n: number | null) => (n ? `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : "[रकम]");

function reportLines(i: LetterInput): string[] {
  const s = i.case.stages;
  const lines: string[] = [];
  if (s.call_1930.on) lines.push(`1930 पर शिकायत: ${date(s.call_1930.on)}${s.call_1930.number ? `, शिकायत नंबर ${s.call_1930.number}` : ""}`);
  if (s.ncrp.on) lines.push(`cybercrime.gov.in पर शिकायत: ${date(s.ncrp.on)}${s.ncrp.number ? `, शिकायत नंबर ${s.ncrp.number}` : ""}`);
  if (s.bank.on) lines.push(`बैंक को शिकायत: ${date(s.bank.on)}${s.bank.number ? `, शिकायत नंबर ${s.bank.number}` : ""}`);
  if (s.police.on) lines.push(`पुलिस में शिकायत: ${date(s.police.on)}${s.police.number ? `, नंबर ${s.police.number}` : ""}`);
  return lines.length ? lines : ["1930 / cybercrime.gov.in पर शिकायत: [तारीख़ और शिकायत नंबर]"];
}

function signature(i: LetterInput, today: string): string[] {
  return ["", "भवदीय/भवदीया,", or(i.name, "आपका नाम"), `पता: ${or(i.address, "आपका पता")}`, `mobile: ${or(i.mobile, "आपका mobile नंबर")}`, `तारीख़: ${date(today)}`];
}

export function buildLetter(kind: LetterKind, i: LetterInput, today: string, lang: LetterLang = "hi"): string[] {
  if (lang === "en") return buildLetterEn(kind, i, today);
  const c = i.case;
  const facts = [
    `ठगी की तारीख़ और समय: ${date(c.txnDate)}, ${c.txnTime ? `लगभग ${formatHindiTime(c.txnTime)}` : "[लगभग समय]"}`,
    `रकम: ${rupees(c.amount)}${c.recovered ? ` (अब तक वापस मिले: ${rupees(c.recovered)})` : ""}`,
    `खाता: ${or(i.bankName, "बैंक का नाम")}, आख़िरी 4 अंक ${or(i.accountLast4, "XXXX")}`,
    `लेन-देन नंबर (UTR): ${or(i.utr, "UTR नंबर")}`,
  ];
  const what = or(i.what, "क्या हुआ, अपने शब्दों में: किसने, कैसे, किस नंबर या link से");

  if (kind === "bank") {
    return [
      "प्रति,",
      "शाखा प्रबंधक,",
      `${or(i.bankName, "बैंक का नाम")}, ${or(i.branch, "शाखा का नाम")}`,
      "",
      `विषय: अनधिकृत / ठगी वाले लेन-देन की शिकायत (खाता, आख़िरी 4 अंक ${or(i.accountLast4, "XXXX")})`,
      "",
      "महोदय/महोदया,",
      `मेरे खाते से ${on(c)} ${rupees(c.amount)} का लेन-देन हुआ। ${howLine(i.how)}`,
      ...facts,
      `क्या हुआ: ${what}`,
      ...reportLines(i),
      "",
      "कृपया:",
      "1. मेरे खाते/card पर आगे के लेन-देन तुरंत रोकें।",
      "2. इस शिकायत का नंबर और पावती दें।",
      "3. RBI के नियमों के अनुसार जाँच करके मेरी रकम लौटाने की कार्रवाई करें, और जवाब लिखित में दें।",
      "",
      "साथ में: पैसे कटने के SMS / statement और शिकायत नंबरों की copy",
      ...signature(i, today),
    ];
  }

  if (kind === "police") {
    return [
      "प्रति,",
      "थाना प्रभारी / प्रभारी, cyber cell,",
      or(i.station, "थाने / cyber cell का नाम और ज़िला"),
      "",
      "विषय: online ठगी की शिकायत",
      "",
      "महोदय/महोदया,",
      `मेरे साथ ${on(c)} online ठगी हुई, जिसमें ${rupees(c.amount)} गए। ${howLine(i.how)}`,
      ...facts,
      `क्या हुआ: ${what}`,
      `ठग की जानकारी (नंबर, UPI ID, link): ${or(i.suspect, "ठग का नंबर / UPI ID / link")}`,
      ...reportLines(i),
      "",
      "कृपया:",
      "1. मेरी शिकायत दर्ज करें, और इसकी पावती या FIR की copy दें।",
      "2. ठग के खाते में मेरी रकम रोकने और वापस दिलाने के लिए ज़रूरी कार्रवाई करें।",
      "",
      "साथ में: पैसे कटने के SMS / statement, chat और call के screenshot, शिकायत नंबरों की copy",
      ...signature(i, today),
    ];
  }

  // RBI Ombudsman: cms.rbi.org.in के डिब्बे में चिपकाने का text (form के बाकी खाने वहीं भरें)
  return [
    `बैंक: ${or(i.bankName, "बैंक का नाम")}, शाखा: ${or(i.branch, "शाखा का नाम")}`,
    `बैंक को शिकायत: ${date(c.stages.bank.on)}, शिकायत नंबर: ${or(c.stages.bank.number, "बैंक का शिकायत नंबर")}`,
    "बैंक का जवाब: [अब तक जवाब नहीं आया / जवाब की तारीख़ और क्या कहा]",
    "",
    "क्या हुआ:",
    `${on(c)} मेरे खाते (आख़िरी 4 अंक ${or(i.accountLast4, "XXXX")}) से ${rupees(c.amount)} कटे। ${howLine(i.how)} लेन-देन नंबर (UTR): ${or(i.utr, "UTR नंबर")}।`,
    what,
    ...reportLines(i),
    "",
    "मैं क्या चाहता/चाहती हूँ:",
    "बैंक RBI के नियमों के अनुसार मेरी शिकायत की जाँच करे और मेरी रकम लौटाए, और देरी व परेशानी के लिए उचित मुआवज़ा दे।",
  ];
}
