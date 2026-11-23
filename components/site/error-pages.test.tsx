import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import ErrorPage from "@/app/error";
import GlobalError from "@/app/global-error";
import { FORBIDDEN_PHRASES, findForbidden } from "@/modules/i18n";

const err = Object.assign(new Error("boom"), { digest: "abc" });

test("error पन्ना: हिंदी, 'आपकी गलती नहीं', 1930 और /turant, फिर से कोशिश", () => {
  const html = renderToStaticMarkup(<ErrorPage error={err} reset={() => {}} />);
  expect(html).toContain("कुछ गड़बड़ हो गई");
  expect(html).toContain("आपकी नहीं");
  expect(html).toContain('href="tel:1930"');
  expect(html).toContain('href="/turant"');
  expect(html).toContain("फिर से कोशिश करें");
  expect(html).not.toContain("boom"); // अंदर की तकनीकी गलती user को नहीं दिखती
  expect(findForbidden(html, FORBIDDEN_PHRASES)).toEqual([]);
});

test("global-error: अपना html lang=hi, 1930 और /turant, बिना बाहरी CSS के भी पढ़ने लायक", () => {
  const html = renderToStaticMarkup(<GlobalError error={err} reset={() => {}} />);
  expect(html).toContain('<html lang="hi"');
  expect(html).toContain('href="tel:1930"');
  expect(html).toContain('href="/turant"');
  expect(html).not.toContain("boom");
});

test("404 और error पन्ने पर भी साइट का header (नाम, पहचान), ताकि पता रहे किस साइट पर हैं", async () => {
  const { default: NotFound } = await import("@/app/not-found");
  for (const html of [renderToStaticMarkup(<NotFound />), renderToStaticMarkup(<ErrorPage error={err} reset={() => {}} />)]) {
    expect(html).toContain("<header");
    expect(html).toContain("डिजिटल ठगी में मुफ़्त मदद");
  }
});
