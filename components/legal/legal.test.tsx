import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, test, vi } from "vitest";
import LegalIndexPage from "@/app/(site)/legal/page";
import PrivacyPage from "@/app/(site)/legal/privacy/page";
import ShikayatPage from "@/app/(site)/legal/shikayat/page";
import TermsPage from "@/app/(site)/legal/terms/page";

afterEach(() => vi.unstubAllEnvs());

test.each([
  ["privacy", PrivacyPage],
  ["terms", TermsPage],
  ["shikayat", ShikayatPage],
] as const)("%s: मसौदे वाली चेतावनी", (_n, Page) => {
  const html = renderToStaticMarkup(<Page />);
  expect(html).toContain("यह मसौदा है: वकील की जाँच अभी बाकी है।");
  expect(html).toContain("मसौदा 2026-11-21");
});

test("privacy: database में नहीं, URL और history वाली सच्चाई, cookie वाला हिस्सा, अधिकार", () => {
  const html = renderToStaticMarkup(<PrivacyPage />);
  expect(html).toContain("किसी database में नहीं");
  expect(html).toContain("browser की history");
  expect(html).toContain("अभी कोई cookie, analytics या विज्ञापन वाला tracker नहीं");
  expect(html).toContain("Digital Personal Data Protection Act, 2023");
  expect(html).toContain("Data Protection Board of India");
});

test("terms: कानूनी सलाह नहीं, नतीजे का वादा नहीं", () => {
  const html = renderToStaticMarkup(<TermsPage />);
  expect(html).toContain("कानूनी सलाह नहीं");
  expect(html).toContain("हम किसी नतीजे का वादा नहीं करते");
});

test("शिकायत: 1930 वाली चेतावनी सबसे पहले, /turant link; env न हो तो नियुक्त नहीं और कोई mailto नहीं", () => {
  const html = renderToStaticMarkup(<ShikayatPage />);
  const warn = html.indexOf("ठगी की शिकायत यहाँ नहीं होती।");
  expect(warn).toBeGreaterThan(-1);
  expect(warn).toBeLessThan(html.indexOf("शिकायत अधिकारी:"));
  expect(html).toContain('href="/turant"');
  expect(html).toContain("अभी नियुक्त नहीं");
  expect(html).not.toContain("mailto:");
});

test("शिकायत: env हो तो नाम और mailto", () => {
  vi.stubEnv("NEXT_PUBLIC_GRIEVANCE_NAME", "सुनीता");
  vi.stubEnv("NEXT_PUBLIC_GRIEVANCE_EMAIL", "shikayat@example.in");
  const html = renderToStaticMarkup(<ShikayatPage />);
  expect(html).toContain("सुनीता");
  expect(html).toContain('href="mailto:shikayat@example.in"');
});

test("/legal: तीनों links", () => {
  const html = renderToStaticMarkup(<LegalIndexPage />);
  for (const href of ["/legal/privacy", "/legal/terms", "/legal/shikayat"]) expect(html).toContain(`href="${href}"`);
});
