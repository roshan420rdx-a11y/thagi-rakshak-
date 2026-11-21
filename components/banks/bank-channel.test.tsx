import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import type { BankChannel } from "@/modules/banks";
import { BankChannelView } from "./bank-channel";

const base = { sourceUrl: "https://x.bank.in/p", sourceQuote: "xxxxxxxxxxxx", verifiedBy: ["claude", "owner"], verifiedOn: "2026-11-22" };

test("tel: बड़ा call बटन, नंबर के साथ", () => {
  const c: BankChannel = { kind: "tel", value: "18002586161", labelHi: "ठगी की report", ...base };
  const html = renderToStaticMarkup(<BankChannelView channel={c} />);
  expect(html).toContain('href="tel:18002586161"');
  expect(html).toContain("1800 258 6161");
  expect(html).toContain("22 नवंबर 2026");
});

test("web: बैंक के .bank.in होम पेज का link, नए tab में", () => {
  const c: BankChannel = { kind: "web", value: "https://x.bank.in/", labelHi: 'होम पेज पर "Report A Fraud" दबाएँ', ...base };
  const html = renderToStaticMarkup(<BankChannelView channel={c} />);
  expect(html).toContain('href="https://x.bank.in/"');
  expect(html).toContain('target="_blank"');
  expect(html).toContain("x.bank.in");
});
