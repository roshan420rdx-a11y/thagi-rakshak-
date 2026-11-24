import { expect, test } from "vitest";
import { checkMessage } from "./check";
import { MAX_CHECK_CHARS } from "./check";
import { cleanOcrText } from "./ocr-text";

test("photo से पढ़ी लाइनें जुड़ें: वाक्य बीच में न टूटे (जाँच के नियम लाइन के पार नहीं देखते)", () => {
  expect(cleanOcrText("Your account will be\nblocked today. Share\nOTP to verify")).toBe("Your account will be blocked today. Share OTP to verify");
  expect(cleanOcrText("पहला हिस्सा\n\nदूसरा हिस्सा")).toBe("पहला हिस्सा\nदूसरा हिस्सा");
  expect(cleanOcrText("veri-\nfication code")).toBe("verification code");
});

test("फ़ालतू खाली जगह और अकेले | हटें (देवनागरी पूर्ण विराम अक्सर | पढ़ा जाता है)", () => {
  expect(cleanOcrText("  OTP   बताइए |  \n")).toBe("OTP बताइए।");
  expect(cleanOcrText("\n\n  \n")).toBe("");
});

test("हद से लंबा न हो", () => {
  expect(cleanOcrText("क ".repeat(MAX_CHECK_CHARS)).length).toBeLessThanOrEqual(MAX_CHECK_CHARS);
});

test("सफ़ाई के बाद जाँच वही पकड़े जो लिखे message में पकड़ती", () => {
  const ocr = "Dear Customer, your KYC is\npending. Your account will be\nblocked today. Update now:\nhttp://sbi-kyc-update.xyz";
  expect(checkMessage(cleanOcrText(ocr)).level).toBe("danger");
});
