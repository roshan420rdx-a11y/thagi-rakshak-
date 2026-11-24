// English वाले पत्र (plan A2i): हिंदी वाले पत्र (letters.ts) जैसे ही तथ्य और वही माँगें, बस English में, ताकि दूसरे राज्य की
// शाखा या थाने में भी पढ़े जा सकें। कोई क़ानूनी धारा, कोई वादा नहीं। ख़ाली खानों पर English वाली "[ ... ]" जगह।
import type { LocalCase } from "@/modules/case";
import { formatEnglishDate, formatEnglishTime } from "@/modules/rules-engine";
import type { HowMoneyWent, LetterInput, LetterKind } from "./letters";

const or = (v: string | null | undefined, blank: string) => (v && v.trim() ? v.trim() : `[${blank}]`);
const date = (d: string | null) => (d ? formatEnglishDate(d) : "[date]");
// "on 20 November 2026 around 4:30 PM (16:30)"; समय न हो तो सिर्फ़ "on 20 November 2026"
const on = (c: LocalCase) => `on ${date(c.txnDate)}${c.txnTime ? ` around ${formatEnglishTime(c.txnTime)}` : ""}`;
const rupees = (n: number | null) => (n ? `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : "[amount]");

function howLine(how: HowMoneyWent): string {
  if (how === "unauthorised") return "I neither made this transaction nor authorised it.";
  if (how === "deceived") return "This transaction was carried out by fraudsters through deception.";
  return "This transaction [was done through fraud / was not done by me: choose one].";
}

function reportLines(i: LetterInput): string[] {
  const s = i.case.stages;
  const num = (n: string, word = "complaint number") => (n ? `, ${word} ${n}` : "");
  const lines: string[] = [];
  if (s.call_1930.on) lines.push(`Complaint on helpline 1930: ${date(s.call_1930.on)}${num(s.call_1930.number)}`);
  if (s.ncrp.on) lines.push(`Complaint on cybercrime.gov.in: ${date(s.ncrp.on)}${num(s.ncrp.number)}`);
  if (s.bank.on) lines.push(`Complaint to the bank: ${date(s.bank.on)}${num(s.bank.number)}`);
  if (s.police.on) lines.push(`Police complaint: ${date(s.police.on)}${num(s.police.number, "number")}`);
  return lines.length ? lines : ["Complaint on helpline 1930 / cybercrime.gov.in: [date and complaint number]"];
}

function signature(i: LetterInput, today: string): string[] {
  return ["", "Yours faithfully,", or(i.name, "your name"), `Address: ${or(i.address, "your address")}`, `Mobile: ${or(i.mobile, "your mobile number")}`, `Date: ${date(today)}`];
}

export function buildLetterEn(kind: LetterKind, i: LetterInput, today: string): string[] {
  const c = i.case;
  const facts = [
    `Date and time of the fraud: ${date(c.txnDate)}, ${c.txnTime ? `around ${formatEnglishTime(c.txnTime)}` : "[approximate time]"}`,
    `Amount: ${rupees(c.amount)}${c.recovered ? ` (received back so far: ${rupees(c.recovered)})` : ""}`,
    `Account: ${or(i.bankName, "bank name")}, last 4 digits ${or(i.accountLast4, "XXXX")}`,
    `Transaction number (UTR): ${or(i.utr, "UTR number")}`,
  ];
  const what = or(i.what, "what happened, in your own words: who, how, from which number or link");

  if (kind === "bank") {
    return [
      "To,",
      "The Branch Manager,",
      `${or(i.bankName, "bank name")}, ${or(i.branch, "branch name")}`,
      "",
      `Subject: Complaint about an unauthorised / fraudulent transaction (account ending ${or(i.accountLast4, "XXXX")})`,
      "",
      "Dear Sir/Madam,",
      `${rupees(c.amount)} was debited from my account ${on(c)}. ${howLine(i.how)}`,
      ...facts,
      `What happened: ${what}`,
      ...reportLines(i),
      "",
      "I request you to:",
      "1. Immediately stop any further transactions on my account/card.",
      "2. Give me the complaint number and an acknowledgement of this complaint.",
      "3. Investigate as per RBI rules, take action to return my money, and reply to me in writing.",
      "",
      "Enclosed: SMS / statement of the debit, and copies of the complaint numbers",
      ...signature(i, today),
    ];
  }

  if (kind === "police") {
    return [
      "To,",
      "The Station House Officer / Officer In-charge, Cyber Cell,",
      "[name of the police station / cyber cell, and district]",
      "",
      "Subject: Complaint of online fraud",
      "",
      "Dear Sir/Madam,",
      `I was the victim of an online fraud ${on(c)}, in which I lost ${rupees(c.amount)}. ${howLine(i.how)}`,
      ...facts,
      `What happened: ${what}`,
      `Details of the fraudster (number, UPI ID, link): ${or(i.suspect, "fraudster's number / UPI ID / link")}`,
      ...reportLines(i),
      "",
      "I request you to:",
      "1. Register my complaint and give me an acknowledgement or a copy of the FIR.",
      "2. Take the necessary action to stop my money in the fraudster's account and get it returned to me.",
      "",
      "Enclosed: SMS / statement of the debit, screenshots of chats and calls, and copies of the complaint numbers",
      ...signature(i, today),
    ];
  }

  // RBI Ombudsman: cms.rbi.org.in के डिब्बे में चिपकाने का text
  return [
    `Bank: ${or(i.bankName, "bank name")}, Branch: ${or(i.branch, "branch name")}`,
    `Complaint to the bank: ${date(c.stages.bank.on)}, complaint number: ${or(c.stages.bank.number, "bank's complaint number")}`,
    "Bank's reply: [no reply so far / date of the reply and what it said]",
    "",
    "What happened:",
    `${rupees(c.amount)} was debited from my account (last 4 digits ${or(i.accountLast4, "XXXX")}) ${on(c)}. ${howLine(i.how)} Transaction number (UTR): ${or(i.utr, "UTR number")}.`,
    what,
    ...reportLines(i),
    "",
    "What I want:",
    "The bank should investigate my complaint as per RBI rules, return my money, and pay suitable compensation for the delay and harassment.",
  ];
}
