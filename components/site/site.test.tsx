import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { BottomNavView } from "./bottom-nav-view";
import { SiteHeader } from "./site-header";

test("BottomNavView: 4 live tabs (मेरा केस भी), चालू पर aria-current", () => {
  const html = renderToStaticMarkup(<BottomNavView current="/bharosa" />);
  expect(html).toContain('aria-label="मुख्य menu"');
  expect(html).toContain('href="/pucho"');
  expect(html).toContain('href="/case"');
  expect(html).toMatch(/href="\/bharosa"[^>]*aria-current="page"|aria-current="page"[^>]*href="\/bharosa"/);
});

test("BottomNavView: होम पर सिर्फ़ होम चालू", () => {
  const html = renderToStaticMarkup(<BottomNavView current="/" />);
  expect((html.match(/aria-current="page"/g) ?? []).length).toBe(1);
});

test("SiteHeader: होम link और 'ठगी हो गई' बटन", () => {
  const html = renderToStaticMarkup(<SiteHeader />);
  expect(html).toContain('href="/"');
  expect(html).toContain('href="/turant"');
  expect(html).toContain("ठगी हो गई");
});
