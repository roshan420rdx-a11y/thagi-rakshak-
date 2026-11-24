import { expect, test } from "vitest";
import { checkMessage } from "./check";
import { normalizeText } from "./normalize";

const ids = (t: string) => checkMessage(t).hits.map((h) => h.id);

// ---- ठगों की चालें: message का रूप बदलकर नियम से बचना ----
test.each([
  ["पूरी-चौड़ाई के अक्षर", "Apna ＯＴＰ bata dijiye verification ke liye"],
  ["गणित वाले मोटे अक्षर", "Please share the 𝐎𝐓𝐏 received on your phone"],
  ["अक्षर अलग-अलग (O T P)", "Sir apna O T P bata dijiye verification ke liye"],
  ["बिंदु लगाकर (O.T.P)", "Please share the O.T.P received on your phone"],
  ["हाइफ़न लगाकर (o-t-p)", "Please share the o-t-p received on your phone"],
  ["O की जगह शून्य (0TP)", "Sir apna 0TP bata dijiye verification ke liye"],
  ["रूसी अक्षर वाला (оtp)", "Sir apna оtp bata dijiye verification ke liye"],
])("OTP माँगना छुपाने की चाल पकड़ी जाती है: %s", (_name, msg) => {
  expect(ids(msg)).toContain("otp_request");
  expect(checkMessage(msg).level).toBe("danger");
});

test("रूसी अक्षर वाला नकली बैंक-पता (sbі-kyc.com) भी 'बैंक जैसा नकली पता' पकड़ता है", () => {
  expect(ids("Your account is blocked. Update KYC at http://sbі-kyc.com now")).toContain("bank_lookalike");
});

test("अलग-अलग अक्षर या अंक वाली चाल UPI/PIN/KYC जैसे चुनिंदा शब्दों पर ही चलती है, आम text नहीं बदलता", () => {
  expect(normalizeText("U P I PIN")).toBe("upi pin");
  expect(normalizeText("p1n daalo")).toBe("pin daalo");
  expect(normalizeText("k.y.c update")).toBe("kyc update");
  // आम text जस का तस
  expect(normalizeText("I am at a b c d store")).toBe("i am at a b c d store");
  expect(normalizeText("ब्लॉक 2024 में 100 रुपये")).toContain("2024 में 100");
  expect(normalizeText("room 304 and gate 5a")).toBe("room 304 and gate 5a");
  expect(normalizeText("a-b")).toBe("a-b");
});

test("NFKC देवनागरी के अक्षरों को नहीं बदलता (वरना हिंदी के नियम बिगड़ते): हर देवनागरी चिह्न पर NFC के बराबर", () => {
  for (let cp = 0x0900; cp <= 0x097f; cp++) {
    const ch = String.fromCodePoint(cp);
    expect(ch.normalize("NFKC"), `U+${cp.toString(16)}`).toBe(ch.normalize("NFC"));
  }
});

test("सादे लैटिन/हिंदी message वैसे ही चलते हैं जैसे पहले", () => {
  expect(ids("OTP 123456 आपके HDFC Bank लेन-देन के लिए है। इसे किसी को न बताएँ।")).not.toContain("otp_request");
  expect(checkMessage("कल शाम मिलते हैं").level).toBe("no_signals");
});

test("बहुत लंबे, चालों से भरे text पर भी तेज़ (ReDoS नहीं): सबसे बुरा हाल 0.3 सेकंड से कम", () => {
  const inputs = [
    "o ".repeat(10000),
    "o.".repeat(10000),
    "a1 ".repeat(7000),
    "0tp ".repeat(5000),
    "ＯＴＰ ".repeat(3500),
    "ο".repeat(20000),
    "a-".repeat(10000),
  ];
  for (const text of inputs) {
    const t0 = performance.now();
    checkMessage(text);
    expect(performance.now() - t0, text.slice(0, 12)).toBeLessThan(300);
  }
});
