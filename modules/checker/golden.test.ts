import { expect, test } from "vitest";
import { checkMessage, CHECKER_RULES } from "@/modules/checker";
import { MANY_SIGNALS } from "@/modules/checker/patterns";
import { ABHYAS_ITEMS } from "@/modules/abhyas";
import { GYAN_PAGES } from "@/modules/gyan";
import { FORBIDDEN_PHRASES, findForbidden } from "@/modules/i18n";

// सुनहरा test-set: ठगी छूट जाना (false negative) सबसे बड़ी गलती है।
// नंबर नकली/छुपाए हुए हैं। किसी असली व्यक्ति या कंपनी का नंबर नहीं।

const fromGyan = GYAN_PAGES.flatMap((p) => p.examplesHi.map((e) => e.replace(/^"|"$/g, "")));

const SCAMS: string[] = [
  ...fromGyan,
  ...ABHYAS_ITEMS.filter((i) => i.scam).map((i) => i.text), // "ठगी या असली?" अभ्यास के ठगी वाले
  "Hello sir, main Airtel se bol raha hoon, aapka SIM band ho jayega, abhi aapke phone par jo OTP aaya hai wo bata dijiye",
  "Dear Consumer, your electricity power will be disconnected tonight at 9.30 pm because your previous month bill was not updated. Please immediately contact our electricity officer 98XXXXXX21",
  "Congratulations! Your number has won Rs 25,00,000 in KBC Lucky Draw. To claim, pay Rs 12,500 GST on WhatsApp",
  "Mam aapka FedEx parcel Mumbai customs ne pakda hai, usme 5 passport aur MDMA mila hai. Call transfer kar raha hoon Mumbai Crime Branch ko",
  "Sir I am from Amazon customer care, aapka refund process karne ke liye AnyDesk app install kijiye",
  "Your loan of Rs 5000 is overdue. Pay today or your morphed photos will be sent to all your contacts",
  "Maine galti se aapke Paytm pe 2000 bhej diye, please wapas kar do, mera beta hospital me hai",
  "Earn ₹5000 daily from home! Just subscribe YouTube channels. Join Telegram: t.me/earnfast",
  "बधाई हो! आपका ₹2,000 का cashback आया है। पैसे पाने के लिए यह QR scan करें और PIN डालें।",
  "मैं तुम्हारा video रिकॉर्ड कर चुका हूँ। ₹20,000 भेजो वरना तुम्हारे सारे रिश्तेदारों को भेज दूँगा।",
  "Join our VIP WhatsApp group for IPO allotment and get 200% profit in 1 month.",
  "आपका बिजली बिल अपडेट नहीं हुआ है। आज रात 9:30 बजे आपका कनेक्शन काट दिया जाएगा। तुरंत 98XXXXXX12 पर संपर्क करें।",
  "Hi, I am HR from a reputed company. Part time work available, earn 2000-5000 per day by rating hotels on Google. Reply YES",
  "TRAI: आपका मोबाइल नंबर 2 घंटे में बंद कर दिया जाएगा क्योंकि इस नंबर से ग़ैरक़ानूनी गतिविधि हुई है। जानकारी के लिए 9 दबाएँ",
  "Dear Customer, your SBI YONO account will be blocked today. Update your PAN immediately: http://sbi-yono-kyc.xyz",
  "Your Netflix subscription expired. Update payment details within 24 hours: http://netflix-renew.co",
  "आपका wallet balance ₹48,000 हो गया है। पैसा निकालने के लिए पहले ₹4,800 withdrawal fee जमा करें।",
  "पापा, मेरा फ़ोन नंबर बदल गया है, यह मेरा नया नंबर है। अभी ₹10,000 भेज दो, बहुत ज़रूरी है",
  // दूसरा दौर: आम भारतीय ठगी के और रूप
  "Aapki bijli aaj raat 9:30 baje kaat di jayegi, turant 98XXXXXX12 par call kare",
  "Sir aapke account mein 5000 credit hua hai, galti se chala gaya, wapas bhej do",
  "Dear user your PAN card is blocked. Update immediately to avoid account suspension: bit.ly/xyz12",
  "Mumbai Police Cyber Cell: aapke Aadhaar se 6 bank account khole gaye hain, aapke khilaf arrest warrant hai",
  "Hello, aapka SIM card 2 ghante me band ho jayega. Re-KYC ke liye 9 dabaye",
  "Congrats! You've been selected for Amazon work from home job. Earn Rs 3000/day. Contact on Telegram",
  "OTP bata do bhai, galti se tumhare number par aa gaya",
  "आपका Paytm KYC expire हो गया है, अभी इस नंबर पर call करें 70XXXXXX45",
  "Hi Mom, my phone broke, this is my new number. Can you send ₹15000 urgently?",
  "Your credit card reward points worth Rs 7,850 expire today. Redeem now: sbicard-rewards.co",
  "Your FASTag has been blacklisted. Complete KYC now to continue using it",
  "आपका आधार कार्ड ग़लत इस्तेमाल हुआ है, CBI officer से बात करने के लिए 1 दबाएँ",
  "Your mobile number will be disconnected within 2 hours by TRAI. Press 9 for more information",
  "Join our stock market WhatsApp group, guaranteed 5% daily returns",
  "Pre-approved loan of Rs 5 lakh! Pay Rs 2,999 processing fee to get disbursement today",
  "I am army officer, want to buy your OLX sofa. I will send QR code, scan it to receive payment",
  "आपके बेटे को पुलिस ने पकड़ लिया है, छुड़ाने के लिए तुरंत ₹50,000 भेजो",
  "India Post: your parcel is on hold due to incomplete address. Update within 24 hours: indiapost-track.top",
  "Hi beta, ye mera naya number hai. Purana wala kharab ho gaya, ise save kar lo.",
  // तीसरा दौर: AePS, SIM swap, call forwarding
  "Aapka SIM 4G se 5G me upgrade karna hai, 121 par SIM space 20 digit number SMS kar dijiye",
  "Aapke aadhaar se ration milna band ho jayega, apne anguthe ka photo whatsapp par bhejo",
  "Sir aapka parcel return ho raha hai, delivery ke liye **21* ke baad ye number dial karo",
  // नकली "पैसे कटे" alert, ठग के नंबर के साथ
  "Dear customer, Rs 10,000 debited from your account. If not you, call 9876543210 immediately.",
  // चौथा दौर: पहले छूटने वाले आम रूप
  "आपकी LIC policy का bonus ₹2,40,000 तैयार है। पाने के लिए ₹12,000 GST आज जमा करें।",
  "आपकी बेटी को ₹25,000 की scholarship मिली है, पाने के लिए ₹1,500 registration fee भेजें।",
  "Hi dear, I sent you a gift with $50,000 cash. The courier company says pay ₹35,000 customs clearance fee to receive it.",
  "आपके बेटे का accident हो गया है, hospital में भर्ती है, तुरंत ₹50,000 भेजो",
  "Sir main army se hoon, aapka sofa kharidna hai, pehle main aapko 1 rupaya bhejta hoon, aap QR scan karke confirm karo",
  "Work from home job, registration fee ₹999 only, earn ₹30,000 per month. Pay on this UPI.",
  "Hello, aapke number par 2 lakh ka loan approve hua hai, sirf 2,000 file charge bhejo",
  "आपकी गैस subsidy रुकी है, KYC के लिए इस नंबर पर call करें 98XXXXXX21",
];

const BENIGN: string[] = [
  ...ABHYAS_ITEMS.filter((i) => !i.scam).map((i) => i.text), // अभ्यास के असली वाले
  "123456 is your OTP for login to SBI YONO. Do not share it with anyone. -SBI",
  "आपका OTP 482913 है। यह 10 मिनट तक मान्य है। इसे किसी के साथ साझा न करें। -PNB",
  "Dear Customer, Rs.500.00 debited from A/c XX1234 on 20-11-26 to VPA shop@okaxis. Not you? Call 18001234567 -Bank",
  "बेटा, शाम को सब्ज़ी लेते आना और दूध भी। मम्मी",
  "Sharma Kirana: आपका बिल ₹1,240। धन्यवाद, फिर पधारें!",
  "कल सुबह 10 से 2 बजे तक मरम्मत के कारण बिजली बंद रहेगी। असुविधा के लिए खेद है। -बिजली विभाग",
  "Happy birthday bhai! Party kab de raha hai?",
  "Your Amazon order #402-1234 has been delivered. Rate your experience in the app.",
  "home loan की EMI ₹12,450 इस महीने 5 तारीख़ को कटेगी। खाते में बैलेंस रखें। -HDFC",
  "मीटिंग कल 11 बजे है, लैपटॉप साथ लाना।",
  "Your UPI payment of Rs 250 to Raju Tea Stall was successful. UPI Ref 412345678901",
  "SBI never asks for OTP, PIN or CVV. Beware of fraud calls.",
  "कृपया अपना OTP किसी को न बताएँ, बैंक कभी OTP नहीं माँगता।",
  "Never share your OTP. Bank never asks you to share OTP.",
  "Sir mera loan approve ho gaya, family ko party dunga",
  "Bhai kal cricket match jeet gaye, party pay karega tu",
  "News: पुलिस ने चोर को गिरफ़्तार किया",
  "please double check the address",
  "Your PIN code 110001 delivery address updated",
  "Your FASTag recharge of Rs 500 is successful.",
  "Your loan EMI of Rs 5,000 is due on 5th. Pay via the bank app to avoid late fee.",
  "पुलिस भर्ती का admit card कल से मिलेगा",
  "Beta, exam ke baad seedha ghar aa jana",
  "Please accept the delivery today. Address PIN-code 110001",
  "पार्सल लेते समय OTP बताएँ नहीं, बस पिन-कोड 110001 मिलाकर accept करें",
  "आधार केंद्र पर अंगूठा लगाकर अपना बायोमेट्रिक अपडेट करवाएँ",
  "Your SIM has been upgraded to 5G. Enjoy faster internet.",
  "बैलेंस देखने के लिए *123# dial करें",
  "अपने अंगूठे के निशान की photo किसी को न भेजें",
  // असली alert: "SMS BLOCK" निर्देश, "as requested", "आपने नहीं किया तो तुरंत बताएँ", UPI ID में नंबर
  "Your A/c XX1234 is debited for Rs.500.00 on 23-11-26. If not done by you, call 18001234567 or SMS BLOCK 1234 to 567676 -Bank",
  "Dear Customer, your debit card ending 1234 has been blocked as requested. For help call 18001234567.",
  "आपके खाते से ₹1,500 ATM से निकाले गए। यह आपने नहीं किया तो तुरंत 1800-XXX-XXXX पर संपर्क करें।",
  "Rs 500 transferred to 9876543210@ybl. If not you, call 18001234567 -Bank",
  "Pay your LIC premium of ₹12,000 before 30 Nov to keep the policy active.",
  "मैं आपको QR भेज रहा हूँ, scan करके ₹250 payment कर दीजिए",
  "Papa ka operation kal hai, hospital ka bill 40,000 aaya hai, maine bhar diya",
  "नया passbook पाने के लिए ₹100 शुल्क शाखा के counter पर जमा करें।",
];

test("गिनती: कम से कम 20 ठगी वाले और 8 आम message", () => {
  expect(SCAMS.length).toBeGreaterThanOrEqual(20);
  expect(BENIGN.length).toBeGreaterThanOrEqual(8);
  expect(fromGyan.length).toBeGreaterThanOrEqual(10);
});

test.each(SCAMS)("ठगी पकड़ी जाए: %s", (msg) => {
  expect(checkMessage(msg).level).not.toBe("no_signals");
});

test.each(BENIGN)("आम message पर कोई निशान नहीं: %s", (msg) => {
  expect(checkMessage(msg).hits.map((h) => h.id)).toEqual([]);
});

test("ज़्यादातर ठगी वाले message 'पक्के निशान' (danger) वाले हों (कम से कम 70%)", () => {
  const danger = SCAMS.filter((m) => checkMessage(m).level === "danger").length;
  expect(danger / SCAMS.length).toBeGreaterThanOrEqual(0.7);
});

// plan C1: task/निवेश का पहला message (जिसमें अभी कुछ माँगा नहीं गया) "शक है" रहता है; बाकी हर उदाहरण danger
test("ज्ञानकोश के उदाहरण: danger, सिवाय task/निवेश के पहले message के", () => {
  const EARLY_STAGE = new Set(["task_job", "investment", "urgency", "link"]);
  for (const p of GYAN_PAGES) {
    for (const e of p.examplesHi) {
      const msg = e.replace(/^"|"$/g, "");
      const r = checkMessage(msg);
      if (p.slug !== "task-investment") expect(r.level, `${p.slug}: ${msg}`).toBe("danger");
      else if (r.level !== "danger") expect(r.hits.length > 0 && r.hits.every((h) => EARLY_STAGE.has(h.id)), msg).toBe(true);
    }
  }
});

test("नियमों के label और समझाने वाली बात में कोई मना किया शब्द नहीं", () => {
  const copy = [...CHECKER_RULES, MANY_SIGNALS].map((r) => `${r.labelHi} ${r.explainHi}`).join("\n");
  expect(findForbidden(copy, FORBIDDEN_PHRASES)).toEqual([]);
});

test("निशान से सही ज्ञानकोश पन्ना, और हर gyan link असली पन्ना", () => {
  const gyanOf = (id: string) => CHECKER_RULES.find((r) => r.id === id)?.gyan;
  expect(gyanOf("electricity_cut")).toBe("bijli-bill");
  expect(gyanOf("lottery_fee")).toBe("lottery-inaam");
  expect(gyanOf("blackmail")).toBe("sextortion");
  expect(gyanOf("loan_threat")).toBe("loan-app");
  expect(gyanOf("loan_advance_fee")).toBe("loan-app");
  expect(gyanOf("kyc_block")).toBe("kyc-link");
  expect(gyanOf("bank_lookalike")).toBe("kyc-link");
  expect(gyanOf("new_number")).toBe("apna-bankar");
  expect(gyanOf("new_number_money")).toBe("apna-bankar");
  expect(gyanOf("wrong_transfer")).toBe("galti-se-paise");
  expect(gyanOf("biometric_ask")).toBe("aeps-angootha");
  expect(gyanOf("sim_swap")).toBe("sim-swap");
  expect(gyanOf("call_forward")).toBe("sim-swap");
  expect(gyanOf("job_fee")).toBe("naukri-fee");
  expect(gyanOf("advance_fee")).toBe("lottery-inaam");
  expect(gyanOf("relative_emergency")).toBe("apna-bankar");
  const slugs = new Set(GYAN_PAGES.map((p) => p.slug as string));
  for (const r of CHECKER_RULES) if (r.gyan) expect(slugs.has(r.gyan), r.id).toBe(true);
});

test("हर नियम कम से कम एक सुनहरे message में काम आए", () => {
  const used = new Set(SCAMS.flatMap((m) => checkMessage(m).hits.map((h) => h.id)));
  expect(CHECKER_RULES.map((r) => r.id).filter((id) => !used.has(id))).toEqual([]);
});
