import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import BharosaPage from "@/app/(site)/bharosa/page";
import HomePage from "@/app/(site)/page";
import PuchoPage from "@/app/(site)/pucho/page";

test("होम: दोनों दरवाज़े; WhatsApp नंबर न हो तो बात करने का बटन नहीं (सिर्फ़ बिना नंबर वाला 'साइट भेजें')", () => {
  const html = renderToStaticMarkup(<HomePage />);
  expect(html).toContain('href="/turant"');
  expect(html).toContain('href="/pucho"');
  expect(html).not.toMatch(/wa\.me\/\d/);
  expect(html).not.toContain("WhatsApp पर बात करें");
});

test("होम: पहली screen पर ही 1930 मिलाने का link (पैसे अभी गए हों तो एक tap)", () => {
  const html = renderToStaticMarkup(<HomePage />);
  expect(html).toContain('href="tel:1930"');
  expect(html).toContain("1930 मिलाएँ");
  expect(html).toContain("पैसे अभी गए हैं? सबसे पहले यह call करें");
  expect(html.indexOf('href="tel:1930"')).toBeLessThan(html.indexOf('href="/pucho"'));
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

test("/pucho: 8 निशान और /turant का दरवाज़ा", () => {
  const html = renderToStaticMarkup(<PuchoPage />);
  expect((html.match(/<li/g) ?? []).length).toBe(8);
  expect(html).toContain("<ol data-signs");
  expect(html).toContain("ठगी के 8 आम निशान");
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

test("होम: 'और मदद' के 6 tiles, साइट भेजने का WhatsApp link (बिना नंबर, सिर्फ़ साइट का पता)", () => {
  const html = renderToStaticMarkup(<HomePage />);
  for (const h of ["/case", "/arzi", "/shikayat-rasta", "/haq", "/gyan/bank", "/gyan"]) expect(html).toContain(`href="${h}"`);
  expect(html).toContain("और मदद");
  expect(html).toMatch(/href="https:\/\/wa\.me\/\?text=[^"]+"/);
});

test("/abhyas: शीर्षक, बिना JS वाला संदेश, ज्ञानकोश का link; अभ्यास mount से पहले कुछ नहीं", async () => {
  const { default: AbhyasPage } = await import("@/app/(site)/abhyas/page");
  const { AbhyasQuiz } = await import("@/components/abhyas/abhyas-quiz");
  const html = renderToStaticMarkup(<AbhyasPage />);
  expect(html).toContain("ठगी पहचानने का अभ्यास");
  expect(html).toContain("<noscript>");
  expect(html).toContain('href="/gyan"');
  expect(renderToStaticMarkup(<AbhyasQuiz pageUrl="https://example.org/abhyas" />)).toBe("");
});

test("होम, /pucho और /gyan से अभ्यास का link", async () => {
  const { default: GyanIndex } = await import("@/app/(site)/gyan/page");
  for (const html of [renderToStaticMarkup(<HomePage />), renderToStaticMarkup(<PuchoPage />), renderToStaticMarkup(<GyanIndex />)]) expect(html).toContain('href="/abhyas"');
});

test("/poster: छपने वाला हिस्सा, 8 बातें, 1930, सरकारी नहीं वाली बात; QR नहीं; होम पर 8वाँ tile", async () => {
  const { default: PosterPage } = await import("@/app/(site)/poster/page");
  const html = renderToStaticMarkup(<PosterPage />);
  expect(html).toContain("data-print-area");
  expect((html.match(/data-poster-rule/g) ?? []).length).toBe(8);
  expect(html).toContain("1930");
  expect(html).toContain("सरकारी संस्था नहीं");
  expect(html).not.toMatch(/qr\s*code|<canvas/i);
  expect(renderToStaticMarkup(<HomePage />)).toContain('href="/poster"');
});

test("404 पन्ना: हिंदी, 1930 मिलाने का link और /turant का दरवाज़ा", async () => {
  const { default: NotFound } = await import("@/app/not-found");
  const html = renderToStaticMarkup(<NotFound />);
  expect(html).toContain("यह पन्ना नहीं मिला");
  expect(html).toContain('href="tel:1930"');
  expect(html).toContain('href="/turant"');
});
