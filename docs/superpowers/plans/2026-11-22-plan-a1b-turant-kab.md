# Plan A1b: /turant पर "यह कब हुआ?" (spec भाग 2, खंड 6.2 का बचा हिस्सा)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans

**Goal:** पैसे जाने वाले /turant पन्नों पर ऊपर छोटा सवाल "यह कब हुआ?" (1 घंटे से कम / आज ही / 1 से 5 दिन पहले / 5 दिन से ज़्यादा पहले)। जवाब के हिसाब से कदमों के ऊपर एक छोटी सलाह, और "अपना हक़ देखें" (/haq/thagi) का link।

**Global Constraints**
- सिर्फ़ browser में (कोई network, कोई storage नहीं)। mount से पहले कुछ नहीं: JS बंद हो तो पन्ना पहले जैसा।
- हक़, पात्रता या deadline का हिसाब यहाँ **नहीं** (DISHA नियम): सलाह सिर्फ़ आम जल्दबाज़ी वाली, सटीक हिसाब के लिए /haq/thagi।
- सिर्फ़ उन प्रकारों पर जहाँ पैसा जा सकता है: upi, card, netbanking, wallet, digital-arrest, investment-task, customer-care-fake, pata-nahi (sextortion और loan-app पर नहीं: वहाँ पहले "पैसे न भेजें")।
- छोटा रहे: 2x2 बटन, ताकि पहला कदम (1930) फ़ोन की पहली screen में ही रहे।
- बातें सावधानी से: "पैसा रुकने की उम्मीद सबसे ज़्यादा", "ज़िम्मेदारी उतनी कम हो सकती है"; कभी "पक्का" नहीं।

### Task 1: `modules/scams/kab.ts` (TDD): विकल्प, सलाह, किन प्रकारों पर `askWhen`
### Task 2: `components/turant/kab-chips.tsx` + /turant/[slug] पर, e2e (चुनने पर सलाह, JS बंद पर कुछ नहीं, पहला कदम पहली screen में, 320px, सुलभता)
