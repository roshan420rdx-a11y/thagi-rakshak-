import { expect, test } from "vitest";
import { FORBIDDEN_PHRASES, findForbidden } from "@/modules/i18n";
import { POSTER_HELP, POSTER_RULES, posterHost } from "@/modules/site/poster";

test("पोस्टर: 8 बातें, हर एक छोटी (पोस्टर पर एक नज़र में), कोई मना किया शब्द नहीं", () => {
  expect(POSTER_RULES).toHaveLength(8);
  for (const r of POSTER_RULES) expect(r.length, r).toBeLessThanOrEqual(80);
  expect(findForbidden([...POSTER_RULES, ...POSTER_HELP].join("\n"), FORBIDDEN_PHRASES)).toEqual([]);
});

test("पोस्टर की बातें साइट की बातों से मेल खाएँ: OTP/PIN, QR, digital arrest, आधार/अंगूठा/SIM", () => {
  const t = POSTER_RULES.join("\n");
  for (const must of ["OTP", "QR", "digital arrest", "अंगूठे", "SIM", "1930"]) expect(t + POSTER_HELP.join("\n"), must).toContain(must);
});

test("ठगी हो जाए तो: 1930, cybercrime.gov.in, बैंक", () => {
  const t = POSTER_HELP.join("\n");
  for (const must of ["1930", "cybercrime.gov.in", "बैंक"]) expect(t).toContain(must);
});

test("साइट का पता पोस्टर के लिए: https:// और आख़िरी / हटाकर", () => {
  expect(posterHost("https://thagi-rakshak.onrender.com/")).toBe("thagi-rakshak.onrender.com");
  expect(posterHost("http://localhost:3000")).toBe("localhost:3000");
});
