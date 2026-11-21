import type { RbiRef } from "./types";

// ज्ञानकोश में इस्तेमाल होने वाले RBI के हवाले (मूल text: docs/sources/rbi)
const SRC_2026 = "docs/sources/rbi/2026-06-24-commercial-banks-rbc-third-amendment.txt";

export const RBI_COERCION: RbiRef = {
  file: SRC_2026,
  paragraph: "4(15A)",
  quote: "executed by the customer by granting approval under coercion or duress from the third-party",
};

export const RBI_FIVE_DAYS: RbiRef = {
  file: SRC_2026,
  paragraph: "76T(1)(b)",
  quote:
    "the victim has reported the fraudulent EBT(s) on the National Cyber Crime Reporting Portal or National Cyber Crime Helpline (1930) and to the bank within five calendar days from its occurrence.",
};

export const RBI_BANK_IN: RbiRef = {
  file: "docs/sources/rbi/2025-04-22-bank-in-domain.txt",
  paragraph: "RBI/2025-26/28, para 3",
  quote:
    "All banks are advised to commence the migration of their existing domains to the ‘.bank.in’ domain and complete the process at the earliest and in any case, not later than October 31, 2025.",
};
