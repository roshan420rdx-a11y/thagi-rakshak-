# सरकारी portals से मिलान (2026-11-23)

मालिक की अनुमति से environment में ये साइटें जोड़ी गईं, और ज्ञानकोश / "शिकायत का रास्ता" की बातें उनके अपने पन्नों से मिलाई गईं।
नीचे के उद्धरण उस दिन के पन्नों से जस के तस हैं।

## Sanchar Saathi (https://sancharsaathi.gov.in/) ✅
- "Sanchar Saathi is a citizen centric initiative of Department of Telecommunications (DoT) …"
- "Chakshu - Report Suspected Fraud Communication" (उदाहरण: "impersonation as DoT / TRAI, police …" through "Call, SMS or WhatsApp")
- "Know Mobile Connections In Your Name … It facilitates a mobile subscriber to check the number of mobile connections taken in his/her name. It also facilitates to report the mobile connection(s) which are either not required or not taken"
- menu में "Mobile App"
- "Report Incoming International Call With Indian Number … international calls received by them with local Indian number (+91-xxxxxxxxxx) … received by illegal telecom setups over internet from foreign country and sent to Indian citizens disguising as domestic calls" → digital-arrest पन्ने का "वे फिर call करें तो?" वाला जवाब।
- हमारी बातें जो इनसे मिलीं: sim-swap पन्ना, "शिकायत का रास्ता" का "पैसे नहीं गए" हिस्सा, "पहले पूछो" का चक्षु वाला link।

- **फ़ोन चोरी/गुम ("How to block lost/stolen mobile handset?"):** "File a report with the police, and keep a copy of the report. Get a duplicate SIM Card for the lost number … you will need to provide this as the primary mobile number (OTP will be sent on this number) … As per TRAI's regulation, SMS facility on re-issued SIMs is enabled after 24 hours of SIM activation. … a copy of police report and an Identity Proof must be provided. You can also provide the mobile purchase invoice. … you will be given a Request ID … for unblocking the IMEI in future." और "Mobile handset which is reported will be blocked for usage in Indian telecom network within 24 hours." → `/turant/phone-chori`।

## UIDAI (https://uidai.gov.in/en/) ✅ (आंशिक)
- सेवाओं में: "Lock/Unlock Biometrics — Secure your Aadhaar with Biometric lock"
- online सेवाओं में "authentication history" और "biometric lock/unlock"
- "Need help with Aadhaar? 1947", "Toll-free Number 1947"
- **नहीं मिला:** unlock थोड़ी देर का है और अपने-आप फिर lock होता है या नहीं (FAQ JavaScript से खुलते हैं)। इसलिए aeps-angootha पन्ने से वह दावा हटाया: अब "काम के बाद फिर lock है या नहीं, देख लें"।
- `myaadhaar.uidai.gov.in` इस environment से नहीं खुली (उनकी तरफ़ से connection reset); उसे चकमा नहीं दिया।

## eMigrate (https://emigrate.gov.in/) ✅
- "Government of India · Ministry of External Affairs"
- "Registered Recruiting Agents for overseas recruitment are agencies which are registered as per the Emigration Act, 1983."
- "2,530 Active Recruiting Agents till date", menu में "Directory"
- Alerts: "List of Unregistered Agencies against which Grievances Received", "Advisory On Overcharging By Agents for Overseas Recruitment"
- हमारी बातें: naukri-fee पन्ना (agent का registration eMigrate पर देखें; शिकायतों वाली सूची)।

## e-Challan (https://echallan.parivahan.gov.in/) ⏳
- इस environment से नहीं खुली (उनकी तरफ़ से connection reset)। अभ्यास के "नकली चालान" message में लिखा पता (echallan.parivahan.gov.in) आम जानकारी से है; मिलान बाकी।

## दोबारा मिलान (2026-11-23, मालिक की अनुमति से; environment में mohfw.gov.in, pib.gov.in, parivahan.gov.in जुड़े)
- **Tele-MANAS 14416 ✅:** `telemanas.mohfw.gov.in` का certificate अधूरा (TLS जाँच बंद करना ठीक नहीं), इसलिए स्वास्थ्य मंत्रालय की PIB press release
  (PRID 2321522, 9 अक्टूबर 2026) से: "…free and confidential services offered through Tele MANAS at 14416, available 24×7 across the country."
  → `2026-11-23-pib-tele-manas.txt`। अब /nambar पर "मिलान बाकी" नहीं।
- **eChallan ✅ (पता):** परिवहन मंत्रालय के portal parivahan.gov.in के menu में "eChallan" → `https://echallan.parivahan.gov.in/` → `2026-11-23-parivahan.txt`।
  eChallan की अपनी साइट अब भी connection reset देती है।
- **myAadhaar:** अब भी connection reset; ज़रूरी बात ("Lock/Unlock Biometrics") uidai.gov.in से पहले ही मिल चुकी है।
- **cybercrime.gov.in (NCRP):** अब भी connection reset; बटन-दर-बटन गाइड के लिए मालिक के screenshot चाहिए (PROGRESS, रुकावटें)।
