import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { getTurantPage } from "@/modules/scams";
import { KabChips } from "./kab-chips";
import { TurantSteps } from "./turant-steps";

test("upi: क्रम से 4 कदम, tel:1930, Google वाली चेतावनी", () => {
  const html = renderToStaticMarkup(<TurantSteps page={getTurantPage("upi")} />);
  expect(html).toContain('id="turant-steps"');
  expect(html.indexOf("1930 पर call करें")).toBeLessThan(html.indexOf("बैंक को आज ही बताएँ"));
  expect(html).toContain('href="tel:1930"');
  expect(html).toContain("नंबर Google पर न खोजें।");
});

test("sextortion: Tele-MANAS और कोई file input नहीं", () => {
  const html = renderToStaticMarkup(<TurantSteps page={getTurantPage("sextortion")} />);
  expect(html).toContain('href="tel:14416"');
  expect(html).not.toContain('type="file"');
});

test("digital-arrest: banner कदमों से पहले", () => {
  const html = renderToStaticMarkup(<TurantSteps page={getTurantPage("digital-arrest")} />);
  expect(html.indexOf("video call पर गिरफ़्तार नहीं करती")).toBeGreaterThan(-1);
  expect(html.indexOf("video call पर गिरफ़्तार नहीं करती")).toBeLessThan(html.indexOf("1930 पर call करें"));
});

test("upi पर Tele-MANAS नहीं", () => {
  expect(renderToStaticMarkup(<TurantSteps page={getTurantPage("upi")} />)).not.toContain("tel:14416");
});

test("मुख्य /turant पन्ने पर कदमों के शीर्षक h3 (ऊपर 'पता नहीं?' वाला h2 है)", () => {
  const html = renderToStaticMarkup(<TurantSteps page={getTurantPage("pata-nahi")} headingLevel={3} />);
  expect(html).toContain("<h3");
  expect(html).not.toContain("<h2");
});

test("अपने पन्ने पर कदम h2 ही रहें (पहले जैसा)", () => {
  const html = renderToStaticMarkup(<TurantSteps page={getTurantPage("upi")} />);
  expect(html).toContain("<h2");
  expect(html).not.toContain("<h3");
});

test("'यह कब हुआ?': mount से पहले कुछ नहीं (JS बंद हो तो पन्ना पहले जैसा)", () => {
  expect(renderToStaticMarkup(<KabChips />)).toBe("");
});
