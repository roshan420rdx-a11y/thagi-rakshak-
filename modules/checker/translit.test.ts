import { expect, test } from "vitest";
import { normalizeText } from "./normalize";
import { latinize } from "./translit";

const L = (s: string) => latinize(normalizeText(s));

test("हिंदी में लिखे अंग्रेज़ी शब्द अंग्रेज़ी रूप में (बोलकर लिखने पर फ़ोन ऐसे ही लिखता है)", () => {
  expect(L("एनडेस्क ऐप से")).toBe("anydesk app से");
  expect(L("एनी डेस्क इंस्टॉल करो")).toBe("anydesk install करो");
  expect(L("टीम व्यूअर डलवाया")).toBe("teamviewer डलवाया");
  expect(L("मुझसे ओटीपी माँगा")).toBe("मुझसे otp मांगा");
  expect(L("यूपीआई पिन डाल दो")).toBe("upi pin डाल दो");
  expect(L("लिंक पर क्लिक करो")).toBe("link पर click करो");
  expect(L("कस्टमर केयर से रिफंड")).toBe("customer care से refund");
  expect(L("वीडियो कॉल पर रहो")).toBe("video call पर रहो");
});

test("हिंदी शब्दों के बीच का हिस्सा नहीं बदलता (शब्द की सीमा)", () => {
  expect(L("सिमरन का कार्डियो")).toBe("सिमरन का कार्डियो");
  expect(L("पिनकोड 110001")).toBe("पिनकोड 110001");
  expect(L("पिन-कोड 110001 और पिन कोड")).toBe("पिन-कोड 110001 और पिन कोड");
  expect(L("आज काल बहुत ठंड है")).toBe("आज काल बहुत ठंड है");
});
