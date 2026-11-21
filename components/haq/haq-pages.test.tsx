import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import FrozenMoneyPage from "@/app/(site)/haq/frozen-money/page";
import HaqIndexPage from "@/app/(site)/haq/page";
import HomePage from "@/app/(site)/page";
import { FailedTxnView } from "./failed-txn-view";
import { ThagiView } from "./thagi-view";

const TODAY = "2027-03-12";
const params = { txn: "2027-03-10", loss: "40000", shared: "yes", how: "credentials_taken", r1930: "2027-03-10", rbank: "2027-03-10" };

test("ख़ाली: सिर्फ़ form, कोई हिसाब नहीं", () => {
  const html = renderToStaticMarkup(<ThagiView params={{}} today={TODAY} />);
  expect(html).toContain('method="get"');
  expect(html).toContain('name="txn"');
  expect(html).not.toContain("आपका हिसाब");
});
test("सही input: हिसाब, संभावित, ₹25,000, भरे मान बने रहें", () => {
  const html = renderToStaticMarkup(<ThagiView params={params} today={TODAY} />);
  expect(html).toContain("आपका हिसाब");
  expect(html).toContain("संभावित");
  expect(html).toContain("₹25,000");
  expect(html).toContain('value="40000"');
  expect(html).toContain("कानूनी सलाह नहीं");
});
test("बैंक को नहीं बताया → /turant वाला link", () => {
  const html = renderToStaticMarkup(<ThagiView params={{ ...params, rbank: "" }} today={TODAY} />);
  expect(html).toContain('href="/turant"');
});
test("ग़लत तारीख़ → ग़लती दिखे, हिसाब नहीं", () => {
  const html = renderToStaticMarkup(<ThagiView params={{ ...params, txn: "2027-02-30" }} today={TODAY} />);
  expect(html).toContain("ठगी की तारीख़ सही नहीं है।");
  expect(html).not.toContain("आपका हिसाब");
});
test("fail लेन-देन: UPI 4 दिन बाद लौटा → ₹300", () => {
  const html = renderToStaticMarkup(<FailedTxnView params={{ ch: "upi_transfer", txn: "2027-03-01", res: "2027-03-05" }} today={TODAY} />);
  expect(html).toContain("₹300");
  expect(html).toContain("2 मार्च 2027");
});
test("freeze वाली गाइड: जाँच बाकी की चेतावनी", () =>
  expect(renderToStaticMarkup(<FrozenMoneyPage />)).toContain("जाँच अभी बाकी"));
test("/haq: तीनों रास्ते", () => {
  const html = renderToStaticMarkup(<HaqIndexPage />);
  for (const href of ["/haq/thagi", "/haq/failed-txn", "/haq/frozen-money"]) expect(html).toContain(`href="${href}"`);
});
test("होम पर /haq का link", () => expect(renderToStaticMarkup(<HomePage />)).toContain('href="/haq"'));
