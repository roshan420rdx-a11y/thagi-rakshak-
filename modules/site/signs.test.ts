import { expect, test } from "vitest";
import { NEVER_LIST, SCAM_SIGNS } from "@/modules/site";

test("8 निशान, OTP वाला दूसरे नंबर पर, आख़िरी में आधार/अंगूठा/SIM", () => {
  expect(SCAM_SIGNS).toHaveLength(8);
  expect(SCAM_SIGNS[1].titleHi).toBe("OTP, PIN या password माँगना");
  expect(SCAM_SIGNS[7].titleHi).toContain("अंगूठे");
  expect(SCAM_SIGNS[7].titleHi).toContain("SIM");
});

test("कभी-नहीं सूची: 7, पहले call वाली शामिल", () => {
  expect(NEVER_LIST).toHaveLength(7);
  expect(NEVER_LIST).toContain("पहले ख़ुद आपको call करना");
  expect(NEVER_LIST).toContain("पैसा वापस आने का पक्का वादा करना");
});
