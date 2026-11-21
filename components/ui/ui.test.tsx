import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { ActionLink } from "./action-link";
import { BigDoor } from "./big-door";
import { ListenButton } from "./listen-button";
import { Notice } from "./notice";
import { SiteFooter } from "./site-footer";
import { StepCard } from "./step-card";

test("BigDoor link, शीर्षक और उप-शीर्षक", () => {
  const html = renderToStaticMarkup(<BigDoor href="/turant" title="मेरे साथ ठगी हो गई" subtitle="अभी मदद पाएँ" tone="danger" />);
  expect(html).toContain('href="/turant"');
  expect(html).toContain("मेरे साथ ठगी हो गई");
  expect(html).toContain("अभी मदद पाएँ");
});

test("ActionLink tel", () => {
  expect(renderToStaticMarkup(<ActionLink action={{ kind: "tel", number: "1930", labelHi: "1930 मिलाएँ" }} />)).toContain('href="tel:1930"');
});

test("ActionLink बाहरी link नए tab में, सुरक्षित rel", () => {
  const html = renderToStaticMarkup(
    <ActionLink action={{ kind: "link", href: "https://cybercrime.gov.in", labelHi: "x", external: true }} />,
  );
  expect(html).toContain('target="_blank"');
  expect(html).toContain('rel="noopener noreferrer"');
});

test("StepCard नंबर, शीर्षक, urgency, status", () => {
  const html = renderToStaticMarkup(
    <StepCard n={1} title="1930 पर call करें" urgency="पहले 30 मिनट सबसे कीमती">
      <p>x</p>
    </StepCard>,
  );
  expect(html).toMatch(/data-status="todo"/);
  expect(html).toContain("1930 पर call करें");
  expect(html).toContain("पहले 30 मिनट सबसे कीमती");
});

test("Notice का मतलब सिर्फ़ रंग से नहीं: role=note और शब्द", () => {
  const html = renderToStaticMarkup(<Notice tone="danger">call काटिए</Notice>);
  expect(html).toContain('role="note"');
  expect(html).toContain("ज़रूरी:");
});

test("SiteFooter में प्रतिज्ञा और 'सरकारी वेबसाइट नहीं'", () => {
  const html = renderToStaticMarkup(<SiteFooter />);
  expect(html).toContain("हम कभी OTP, PIN, password नहीं माँगते, न screen-share करवाते हैं, न पहले call करते हैं।");
  expect(html).toContain("यह सरकारी वेबसाइट नहीं है। हम आपको सरकारी और बैंक के सही रास्तों तक पहुँचाने में मदद करते हैं।");
  expect(html).toContain("यहाँ दी गई जानकारी कानूनी सलाह नहीं है।");
});

test("ListenButton server पर कुछ नहीं दिखाता (बिना JS के बेकार बटन नहीं)", () => {
  expect(renderToStaticMarkup(<ListenButton targetId="x" />)).toBe("");
});

test("SiteFooter में legal पन्नों के links", () => {
  const html = renderToStaticMarkup(<SiteFooter />);
  for (const href of ["/legal/privacy", "/legal/terms", "/legal/shikayat"]) expect(html).toContain(`href="${href}"`);
});
