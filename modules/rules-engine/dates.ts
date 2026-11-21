// तारीख़ें "YYYY-MM-DD" strings में; सारी गिनती UTC में (timezone से गड़बड़ न हो)।

const DAY_MS = 86_400_000;
const MONTHS_HI = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];

function toUtc(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function fromUtc(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export function isValidIsoDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  return fromUtc(toUtc(s)) === s;
}

export function addDays(iso: string, n: number): string {
  return fromUtc(toUtc(iso) + n * DAY_MS);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((toUtc(to) - toUtc(from)) / DAY_MS);
}

// बैंक के कार्य-दिवस (अनुमान): रविवार और महीने के दूसरे/चौथे शनिवार छोड़कर। सरकारी छुट्टियाँ नहीं घटतीं।
// from के अगले दिन से to तक गिनती (RBI: "excluding the date of receiving the communication")
function isBankHoliday(ms: number): boolean {
  const d = new Date(ms);
  const dow = d.getUTCDay();
  if (dow === 0) return true;
  if (dow === 6) {
    const nth = Math.ceil(d.getUTCDate() / 7);
    return nth === 2 || nth === 4;
  }
  return false;
}

export function workingDaysBetween(from: string, to: string): number {
  let count = 0;
  for (let ms = toUtc(from) + DAY_MS; ms <= toUtc(to); ms += DAY_MS) {
    if (!isBankHoliday(ms)) count++;
  }
  return count;
}

// from के बाद n कार्य-दिवस वाली तारीख़
export function addWorkingDays(from: string, n: number): string {
  let ms = toUtc(from);
  let left = n;
  while (left > 0) {
    ms += DAY_MS;
    if (!isBankHoliday(ms)) left--;
  }
  return fromUtc(ms);
}

export function formatHindiDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS_HI[m - 1]} ${y}`;
}

export function todayInKolkata(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
}
