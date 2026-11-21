import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import BankPage from "@/app/(site)/gyan/bank/[slug]/page";
import BankIndexPage from "@/app/(site)/gyan/bank/page";
import { BANKS } from "@/modules/banks";

test("/gyan/bank: 10 बैंक, 6 सुझाव, Google चेतावनी", () => {
  const html = renderToStaticMarkup(<BankIndexPage />);
  for (const b of BANKS) expect(html).toContain(`href="/gyan/bank/${b.slug}"`);
  expect(html).toContain(".bank.in");
  expect(html).toContain("नंबर Google पर न खोजें।");
  expect((html.match(/data-tip=/g) ?? []).length).toBe(6);
});

test.each(BANKS.map((b) => b.slug))("/gyan/bank/%s: बिना दो-जाँच कोई tel: या .bank.in link नहीं", async (slug) => {
  const html = renderToStaticMarkup(await BankPage({ params: Promise.resolve({ slug }) }));
  expect(html).not.toContain("tel:");
  expect(html).not.toMatch(/href="https:\/\/[^"]*\.bank\.in/);
  expect(html).toContain("अभी जाँच में हैं");
  expect(html).toContain('href="/turant"');
});
