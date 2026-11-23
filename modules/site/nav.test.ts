import { expect, test } from "vitest";
import { HEADER_NAV, NAV_ITEMS, isCurrentPath, liveNavItems } from "@/modules/site";

test("menu: 4 चीज़ें, 'मेरा केस' (फ़ोन वाला) भी live", () => {
  expect(NAV_ITEMS.map((n) => n.href)).toEqual(["/", "/pucho", "/case", "/bharosa"]);
  expect(liveNavItems().map((n) => n.labelHi)).toEqual(["होम", "पूछो", "मेरा केस", "भरोसा"]);
});

test("desktop का ऊपर वाला menu: 7 चीज़ें, पूरी साइट के मुख्य हिस्से", () => {
  expect(HEADER_NAV.map((n) => n.href)).toEqual(["/", "/pucho", "/gyan", "/case", "/arzi", "/nambar", "/bharosa"]);
  expect(HEADER_NAV.map((n) => n.labelHi)).toEqual(["होम", "पहले पूछो", "ज्ञानकोश", "मेरा केस", "अर्ज़ियाँ", "ज़रूरी नंबर", "भरोसा"]);
});

test("कौन-सा पन्ना खुला है: होम सिर्फ़ '/' पर, बाकी अपने नीचे के पन्नों पर भी", () => {
  expect(isCurrentPath("/", "/")).toBe(true);
  expect(isCurrentPath("/", "/gyan")).toBe(false);
  expect(isCurrentPath("/gyan", "/gyan/sim-swap")).toBe(true);
  expect(isCurrentPath("/gyan", "/gyanx")).toBe(false);
});
