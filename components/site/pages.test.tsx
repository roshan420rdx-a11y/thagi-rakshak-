import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import BharosaPage from "@/app/(site)/bharosa/page";
import HomePage from "@/app/(site)/page";
import PuchoPage from "@/app/(site)/pucho/page";

test("होम: दोनों दरवाज़े, नंबर न हो तो WhatsApp नहीं", () => {
  const html = renderToStaticMarkup(<HomePage />);
  expect(html).toContain('href="/turant"');
  expect(html).toContain('href="/pucho"');
  expect(html).not.toContain("wa.me");
});

test("/bharosa: 'वह ठग है' और नकली पेजों का ख़ाली हाल", () => {
  const html = renderToStaticMarkup(<BharosaPage />);
  expect(html).toContain("वह ठग है।");
  expect(html).toContain("अभी तक कोई नकली पेज नहीं मिला।");
  expect(html).toContain("जल्द शुरू होगा");
});

test("/pucho: 7 निशान और /turant का दरवाज़ा", () => {
  const html = renderToStaticMarkup(<PuchoPage />);
  expect((html.match(/<li/g) ?? []).length).toBe(7);
  expect(html).toContain('href="/turant"');
});
