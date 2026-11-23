import { expect, test } from "vitest";
import { OG_IMAGE, pageMeta } from "@/modules/site/meta";

test("हर पन्ने के preview में वही तस्वीर (1200×630, हिंदी alt में 1930)", () => {
  const m = pageMeta({ title: "जाँच", description: "कुछ", path: "/x" });
  expect(m.openGraph?.images).toEqual([OG_IMAGE]);
  expect(OG_IMAGE).toMatchObject({ url: "/og-image.png", width: 1200, height: 630 });
  expect(OG_IMAGE.alt).toContain("1930");
});
