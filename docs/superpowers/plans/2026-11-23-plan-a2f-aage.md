# Plan A2f: और आसान, और आगे (TR-33)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans

**Goal:** मालिक की माँग (2026-11-23): "और perfect, और advanced, और इस्तेमाल में आसान"। पीड़ित के तीन सबसे भारी पल:
(1) message कहाँ से कैसे copy करके जाँचें, (2) घबराहट में कौन-सा कदम हो गया, कौन-सा बाकी, (3) "मुझे क्या चाहिए, वह कहाँ है"।

## बदलाव
1. **Share से सीधे जाँच (Web Share Target):** ऐप (home screen) जोड़ा हो, तो WhatsApp/SMS में message पर उँगली दबाकर
   Share → "ठगी रक्षक" → सीधे "पहले पूछो" का नतीजा। message **service worker फ़ोन के अंदर ही** लेता है (POST `/pucho/share`
   network पर नहीं जाता), Cache Storage के एक अलग डिब्बे में रखता है, और पन्ना उसे पढ़ते ही मिटा देता है। अगर कभी service
   worker न हो, तो server वाला रास्ता body पढ़े बिना `/pucho` पर भेज देता है, और पन्ना "message चिपकाएँ" कहता है।
2. **"हो गया ✓" (/turant):** हर कदम पर "हो गया" बटन, ऊपर "3 में से 1 कदम पूरा"। सिर्फ़ इसी फ़ोन में (localStorage), offline
   भी; बिना JS के कदम पहले जैसे। "सब फिर से" से साफ़।
3. **पूरी साइट में खोज:** "क्या ढूँढ रहे हैं?" (ज़रूरी नंबर, /turant के प्रकार, औज़ार, ज्ञानकोश), वही नुक़्ता/मात्रा/हिंदी-अंग्रेज़ी
   वाली छँटाई। desktop पर header में, फ़ोन पर होम पर।

## जाँच
- unit: shared text पढ़ना/मिटाना (नकली caches), manifest का share_target, service worker में POST वाला रास्ता, कदमों की
  याद (parse/toggle), खोज का index और छँटाई।
- e2e: service worker के साथ form POST → नतीजा, message server तक नहीं (server वाला रास्ता अलग पता देता है), URL में
  message नहीं; "हो गया" reload/offline के बाद भी; खोज; सुलभता light/dark।
