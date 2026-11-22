import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { MeraCase } from "./mera-case";

test("MeraCase: mount से पहले कुछ नहीं (data सिर्फ़ फ़ोन में, server पर कुछ नहीं)", () => {
  expect(renderToStaticMarkup(<MeraCase />)).toBe("");
});

test("/case पन्ना: शीर्षक, बिना JS वाला संदेश और शिकायत के रास्ते का link", async () => {
  const { default: CasePage } = await import("@/app/(site)/case/page");
  const html = renderToStaticMarkup(<CasePage />);
  expect(html).toContain("मेरा केस");
  expect(html).toContain("<noscript>");
  expect(html).toContain('href="/shikayat-rasta"');
});

test("/arzi पन्ना: शीर्षक, बिना JS वाला संदेश; ArziBuilder mount से पहले कुछ नहीं", async () => {
  const { default: ArziPage } = await import("@/app/(site)/arzi/page");
  const { ArziBuilder } = await import("@/components/arzi/arzi-builder");
  const html = renderToStaticMarkup(<ArziPage />);
  expect(html).toContain("अर्ज़ियाँ");
  expect(html).toContain("<noscript>");
  expect(renderToStaticMarkup(<ArziBuilder />)).toBe("");
});
