# Plan C1b: "पहले पूछो" में link का असली पता (TR-23a का दूसरा हिस्सा)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans

**Goal:** message में link हो, तो नतीजे में उसका असली पता (domain) दिखे, और बैंक के नाम वाला पता `.bank.in` पर ख़त्म न हो, तो अलग निशान (`bank_lookalike`, warn) लगे।

**आधार:** RBI/2025-26/28 (`docs/sources/rbi/2025-04-22-bank-in-domain.txt`): `.bank.in` सिर्फ़ बैंकों के लिए, IDRBT अकेला registrar, सारे बैंक 31 अक्टूबर 2025 तक इस पर आएँ।

## Global Constraints
- पते सिर्फ़ फ़ोन पर, नतीजे में दिखें। **share text में कभी नहीं** (वह message का हिस्सा है)।
- ज़्यादा से ज़्यादा 5 पते, `www.` हटाकर, छोटे अक्षरों में।
- `.bank.in` वाले पते को "सुरक्षित" नहीं कहा जाएगा; सिर्फ़ लिखा जाएगा कि यह पता सिर्फ़ बैंक ले सकते हैं, फिर भी पता ख़ुद टाइप करें।

### Task 1: `extractDomains` + `bank_lookalike` (TDD) → commit
### Task 2: VerdictCard में "message में मिले पते" + share में पता नहीं (test) + e2e → commit
