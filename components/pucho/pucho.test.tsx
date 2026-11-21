import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { checkMessage } from "@/modules/checker";
import { verdictShareText } from "@/modules/checker/share";
import { CheckerBox } from "./checker-box";
import { VerdictCard } from "./verdict-card";

const PAGE = "https://example.org/pucho";

test("danger: पक्के निशान, कारण, ज्ञानकोश link, सही /turant, परिवार को भेजें", () => {
  const html = renderToStaticMarkup(<VerdictCard result={checkMessage("मैंने ₹5,000 की request भेजी है, PIN डालकर accept कर लीजिए")} pageUrl={PAGE} />);
  expect(html).toContain("ठगी के पक्के निशान");
  expect(html).toContain("पैसे पाने के लिए PIN डालने को कहना");
  expect(html).toContain('href="/gyan/upi-pin-qr"');
  expect(html).toContain('href="/turant/upi"');
  expect(html).toContain("पैसे जा चुके हैं?");
  expect(html).toContain("परिवार को भेजें");
});

test("danger बिना turant वाले निशान पर /turant/pata-nahi", () => {
  const html = renderToStaticMarkup(<VerdictCard result={checkMessage("शादी का कार्ड भेज रहे हैं: Wedding_Invitation.apk")} pageUrl={PAGE} />);
  expect(html).toContain('href="/turant/pata-nahi"');
});

test("warn: शक है, कोई /turant बटन नहीं", () => {
  const html = renderToStaticMarkup(<VerdictCard result={checkMessage("URGENT: last chance to claim")} pageUrl={PAGE} />);
  expect(html).toContain("शक है");
  expect(html).toContain("जल्दबाज़ी करवाना");
  expect(html).not.toContain('href="/turant');
  expect(html).toContain("परिवार को भेजें");
});

test("no_signals: कभी 'सुरक्षित' नहीं, और फिर भी सावधानी", () => {
  const html = renderToStaticMarkup(<VerdictCard result={checkMessage("कल शाम मिलते हैं")} pageUrl={PAGE} />);
  expect(html).toContain("आम निशान नहीं मिले");
  expect(html).toContain("OTP/PIN किसी को न बताएँ");
  expect(html).not.toContain("सुरक्षित");
  expect(html).not.toMatch(/\bsafe\b/i);
  expect(html).not.toContain("परिवार को भेजें");
});

test("share link में user के message का कोई हिस्सा नहीं, सिर्फ़ नतीजा और कारण", () => {
  const msg = "Zebra7781 बोल रहा हूँ, AnyDesk डालो, call 9123456780";
  const result = checkMessage(msg);
  const html = renderToStaticMarkup(<VerdictCard result={result} pageUrl={PAGE} />);
  const href = html.match(/href="(https:\/\/wa\.me\/\?text=[^"]+)"/)?.[1];
  expect(href).toBeTruthy();
  const shared = decodeURIComponent(href!.replace(/&amp;/g, "&").split("text=")[1]);
  for (const part of ["Zebra", "7781", "9123456780", "डालो"]) expect(shared).not.toContain(part);
  expect(shared).toContain("AnyDesk या TeamViewer जैसा ऐप डलवाना");
  expect(shared).toContain(PAGE);
  expect(shared).toBe(verdictShareText(result, PAGE));
});

test("CheckerBox: mount से पहले कुछ नहीं (बिना JS के box नहीं दिखेगा)", () => {
  expect(renderToStaticMarkup(<CheckerBox pageUrl={PAGE} />)).toBe("");
});
