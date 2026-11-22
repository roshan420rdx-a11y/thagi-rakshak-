// "मेरा केस" से बाहर ले जाने लायक चीज़ें, सब फ़ोन में ही बनती हैं:
// (1) सार का text (copy करके बैंक/थाने में दिखाने या भेजने के लिए), (2) phone के calendar के लिए .ics file।
import { SHIKAYAT_STAGES } from "@/modules/shikayat";
import { addDays, formatHindiDate, type Deadline } from "@/modules/rules-engine";
import { STAGE_IDS, caseDeadlines, type LocalCase } from "./local";

const TITLE = Object.fromEntries(SHIKAYAT_STAGES.map((s) => [s.id, s.titleHi])) as Record<string, string>;
const rupees = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export function caseSummaryText(c: LocalCase, today: string): string {
  const lines = ["मेरे केस का सार (ठगी रक्षक)"];
  lines.push(`ठगी की तारीख़: ${c.txnDate ? formatHindiDate(c.txnDate) : "नहीं भरी"}`);
  lines.push(`रकम: ${c.amount ? rupees(c.amount) : "नहीं भरी"}${c.recovered ? ` · वापस मिले: ${rupees(c.recovered)}` : ""}`);
  lines.push("", "शिकायतें:");
  for (const id of STAGE_IDS) {
    const s = c.stages[id];
    lines.push(
      s.on ? `${TITLE[id]}: ${formatHindiDate(s.on)}${s.number ? ` · शिकायत नंबर: ${s.number}` : ""}` : `${TITLE[id]}: अभी नहीं`,
    );
  }
  const d = caseDeadlines(c, today);
  if (d.length) {
    lines.push("", "आगे की तारीख़ें (RBI के नियमों से):");
    for (const x of d) lines.push(`${x.labelHi}: ${formatHindiDate(x.date)}${x.status === "likely" ? " (अनुमान)" : ""}`);
  }
  return lines.join("\n");
}

// iCalendar (RFC 5545): हर तारीख़ पूरे दिन का event। text के ख़ास अक्षर escape, लाइनें CRLF से।
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
const ymd = (d: string) => d.replace(/-/g, "");

export function caseIcs(deadlines: readonly Deadline[], stamp: string): string {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Thagi Rakshak//Mera Case//HI", "CALSCALE:GREGORIAN"];
  deadlines.forEach((d, i) => {
    lines.push(
      "BEGIN:VEVENT",
      `UID:thagi-rakshak-${ymd(d.date)}-${i}@mera-case`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${ymd(d.date)}`,
      `DTEND;VALUE=DATE:${ymd(addDays(d.date, 1))}`,
      `SUMMARY:${esc(`${d.labelHi}${d.status === "likely" ? " (अनुमान)" : ""}`)}`,
      `DESCRIPTION:${esc("ठगी रक्षक: मेरा केस। तारीख़ RBI के नियमों से निकाली गई है; बैंक या RBI से पक्का करें।")}`,
      "END:VEVENT",
    );
  });
  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}
