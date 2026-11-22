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

test("/bharosa: आपकी जानकारी कहाँ जाती है ('पहले पूछो' का message कहीं नहीं), निजता पन्ने का link", () => {
  const html = renderToStaticMarkup(<BharosaPage />);
  expect(html).toContain("आपकी जानकारी कहाँ जाती है");
  expect(html).toContain("आपके फ़ोन में ही जाँचा जाता है");
  expect(html).toContain('href="/legal/privacy"');
});

test("/pucho: 7 निशान और /turant का दरवाज़ा", () => {
  const html = renderToStaticMarkup(<PuchoPage />);
  expect((html.match(/<li/g) ?? []).length).toBe(7);
  expect(html).toContain('href="/turant"');
});

test("/shikayat-rasta: पाँच पड़ाव, 1930, cybercrime.gov.in, cms.rbi.org.in, 14448 और RBI मूल text", async () => {
  const { default: ShikayatRastaPage } = await import("@/app/(site)/shikayat-rasta/page");
  const html = renderToStaticMarkup(<ShikayatRastaPage />);
  expect((html.match(/<li data-status=/g) ?? []).length).toBe(5);
  for (const h of ['href="tel:1930"', 'href="https://cybercrime.gov.in"', 'href="https://cms.rbi.org.in"', 'href="tel:14448"', 'href="https://www.rbi.org.in/commonman/']) expect(html).toContain(h);
  expect(html).toContain('id="shikayat-steps"');
});

test("होम पर 'शिकायत का पूरा रास्ता' का link", () => {
  expect(renderToStaticMarkup(<HomePage />)).toContain('href="/shikayat-rasta"');
});
