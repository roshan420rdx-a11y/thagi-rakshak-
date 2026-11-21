// fail हुए लेन-देन (ठगी नहीं): RBI circular RBI/2019-20/67, 20 सितंबर 2019 का Annex
// (मूल text: docs/sources/rbi/2019-09-20-tat-failed-transactions.txt)
import { addDays, daysBetween } from "../dates";
import { SRC_TAT_2019 } from "../sources";
import type { Source } from "../types";

export type TatChannel =
  | "atm"
  | "card_to_card"
  | "pos"
  | "ecommerce"
  | "imps"
  | "upi_transfer"
  | "upi_merchant"
  | "aeps_merchant"
  | "aeps_transfer"
  | "apbs"
  | "nach_credit"
  | "nach_revoked_mandate"
  | "ppi_onus";

// row = Annex की पंक्ति। 2c, 5b, 7b के आख़िरी खाने ऊपर वाली पंक्ति के साथ मिले (merged) हैं।
export const TAT_ROWS: Record<TatChannel, { labelHi: string; days: 1 | 5; perDay: 100; row: string }> = {
  atm: { labelHi: "ATM से पैसे नहीं निकले, खाते से कट गए", days: 5, perDay: 100, row: "1a" },
  card_to_card: { labelHi: "card से card में भेजे, पहुँचे नहीं", days: 1, perDay: 100, row: "2a" },
  pos: { labelHi: "दुकान की मशीन (POS) पर card से कटे, पर्ची नहीं निकली", days: 5, perDay: 100, row: "2b" },
  ecommerce: { labelHi: "online ख़रीदारी में कटे, दुकान तक नहीं पहुँचे", days: 5, perDay: 100, row: "2c" },
  imps: { labelHi: "IMPS से भेजे, पहुँचे नहीं", days: 1, perDay: 100, row: "3a" },
  upi_transfer: { labelHi: "UPI से किसी को भेजे, पहुँचे नहीं", days: 1, perDay: 100, row: "4a" },
  upi_merchant: { labelHi: "UPI से दुकान को भुगतान, कटे पर पहुँचे नहीं", days: 5, perDay: 100, row: "4b" },
  aeps_merchant: { labelHi: "आधार (AePS) से दुकान पर भुगतान, कटे पर पहुँचे नहीं", days: 5, perDay: 100, row: "5a" },
  aeps_transfer: { labelHi: "आधार (AePS) से भेजे, पहुँचे नहीं", days: 5, perDay: 100, row: "5b" },
  apbs: { labelHi: "सरकारी फ़ायदा (APBS) खाते में देर से आया", days: 1, perDay: 100, row: "6a" },
  nach_credit: { labelHi: "NACH से पैसा आने में देर", days: 1, perDay: 100, row: "7a" },
  nach_revoked_mandate: { labelHi: "mandate रद्द करने के बाद भी पैसा कटा", days: 1, perDay: 100, row: "7b" },
  ppi_onus: { labelHi: "wallet/prepaid card के अंदर का भुगतान अटका", days: 1, perDay: 100, row: "8b" },
};

export const TAT_SOURCE: Source = {
  ...SRC_TAT_2019,
  paragraph: "Annex, para 5, para 6",
  quote: "Customers who do not get the benefit of redress of the failure as defined in the TAT, can register a complaint with the",
};

export type FailedTxnResult = { dueDate: string; daysLate: number; compensation: number; resolvedOn: string | null; source: Source };

export function evaluateFailedTxn(
  input: { channel: TatChannel; txnDate: string; resolvedOn: string | null },
  today: string,
): FailedTxnResult {
  const row = TAT_ROWS[input.channel];
  const dueDate = addDays(input.txnDate, row.days);
  const daysLate = Math.max(0, daysBetween(dueDate, input.resolvedOn ?? today));
  return { dueDate, daysLate, compensation: daysLate * row.perDay, resolvedOn: input.resolvedOn, source: TAT_SOURCE };
}
