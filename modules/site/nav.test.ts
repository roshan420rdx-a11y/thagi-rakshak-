import { expect, test } from "vitest";
import { NAV_ITEMS, liveNavItems } from "@/modules/site";

test("menu: 4 चीज़ें, 'मेरा केस' (फ़ोन वाला) भी live", () => {
  expect(NAV_ITEMS.map((n) => n.href)).toEqual(["/", "/pucho", "/case", "/bharosa"]);
  expect(liveNavItems().map((n) => n.labelHi)).toEqual(["होम", "पूछो", "मेरा केस", "भरोसा"]);
});
