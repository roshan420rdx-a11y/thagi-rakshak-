import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import GyanPageRoute from "@/app/(site)/gyan/[slug]/page";
import GyanIndexPage from "@/app/(site)/gyan/page";
import PuchoPage from "@/app/(site)/pucho/page";
import TurantPageRoute from "@/app/turant/[slug]/page";
import { GYAN_PAGES } from "@/modules/gyan";

test.each(GYAN_PAGES.map((p) => [p.slug, p] as const))("/gyan/%s: ढाँचा, सही /turant link, ईमानदार meta लाइन", async (slug, p) => {
  const html = renderToStaticMarkup(await GyanPageRoute({ params: Promise.resolve({ slug }) }));
  expect(html).toContain(`href="/turant/${p.turantSlug}"`);
  expect((html.match(/data-sign=/g) ?? []).length).toBe(5);
  expect((html.match(/<details/g) ?? []).length).toBe(p.faq.length);
  expect(html).toContain("30 सेकंड में");
  expect(html).toContain("विशेषज्ञ (वकील या बैंक अधिकारी) की जाँच: अभी बाकी");
  expect(html).toContain('href="/haq/thagi"');
});

test("/gyan: पाँचों पन्ने और काम के रास्ते", () => {
  const html = renderToStaticMarkup(<GyanIndexPage />);
  for (const p of GYAN_PAGES) expect(html).toContain(`href="/gyan/${p.slug}"`);
  for (const href of ["/turant", "/haq/thagi", "/haq/frozen-money", "/gyan/bank"]) expect(html).toContain(`href="${href}"`);
});

test("/pucho से ज्ञानकोश का link", () => expect(renderToStaticMarkup(<PuchoPage />)).toContain('href="/gyan"'));

test("/turant/customer-care-fake से दोनों जुड़े ज्ञानकोश पन्ने", async () => {
  const html = renderToStaticMarkup(await TurantPageRoute({ params: Promise.resolve({ slug: "customer-care-fake" }) }));
  expect(html).toContain('href="/gyan/customer-care-fake"');
  expect(html).toContain('href="/gyan/apk-file"');
});
