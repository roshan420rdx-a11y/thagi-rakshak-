import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { evaluateRights } from "@/modules/rules-engine";
import { BASE_2027 } from "@/modules/rules-engine/test-helpers";
import { RightsResultCard } from "./rights-result";
import { SourceLine } from "./source-line";

const comp = evaluateRights(BASE_2027, "2027-03-12").find((r) => r.ruleId === "rbi2027.smallValueCompensation")!;

test("मुआवज़ा card: संभावित, ₹25,000, रकम का label, स्रोत", () => {
  const html = renderToStaticMarkup(<RightsResultCard result={comp} />);
  expect(html).toContain("संभावित");
  expect(html).toContain("₹25,000");
  expect(html).toContain("संभावित मुआवज़ा");
  expect(html).toContain("76T(1)");
});
test("पुराने नियम में रकम = ज़िम्मेदारी", () => {
  const r = evaluateRights({ ...BASE_2027, txnDate: "2026-12-01", fault: "third_party", accountKind: "savings", reportedTo1930On: "2026-12-01", reportedToBankOn: "2026-12-08" }, "2026-12-20")[0];
  expect(renderToStaticMarkup(<RightsResultCard result={r} />)).toContain("आपकी ज़्यादा से ज़्यादा ज़िम्मेदारी");
});
test("deadline हिंदी तारीख़ में", () => {
  const r = evaluateRights({ ...BASE_2027, reportedToBankOn: null }, "2027-03-12").find((x) => x.ruleId === "rbi2027.smallValueCompensation")!;
  expect(renderToStaticMarkup(<RightsResultCard result={r} />)).toContain("15 मार्च 2027");
});
test("SourceLine: मूल text link और दूसरी जाँच बाकी", () => {
  const html = renderToStaticMarkup(<SourceLine source={comp.source} verifiedBy={["claude"]} />);
  expect(html).toContain('href="https://www.rbi.org.in/');
  expect(html).toContain("मूल text");
  expect(html).toContain("दूसरी जाँच बाकी");
  expect(renderToStaticMarkup(<SourceLine source={comp.source} verifiedBy={["claude", "owner"]} />)).not.toContain("दूसरी जाँच बाकी");
});
