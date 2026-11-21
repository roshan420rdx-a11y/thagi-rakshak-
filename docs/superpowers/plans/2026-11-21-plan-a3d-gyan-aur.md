# Plan A3d: ज्ञानकोश के 4 और पन्ने ("पहले पूछो" के निशानों से जुड़े) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** "पहले पूछो" के 4 danger निशानों (बिजली कटना, लॉटरी की fee, video/photo की धमकी, loan की धमकी) के लिए ज्ञानकोश पन्ने, ताकि नतीजे से सीधे "इस ठगी के बारे में पढ़ें" link मिले, और /turant से "विस्तार से" link।

**Architecture:** plan A3b वाला ही ढाँचा (`content/gyan/hi/*.ts`, typed `GyanPage`, गिनती वाले नियम tests से)। कोई नई dependency नहीं। RBI का कोई quote नहीं जोड़ा जाएगा जब तक मूल text न हो; कोई आँकड़ा नहीं गढ़ा जाएगा। हर पन्ने पर `reviewer: null`।

**[Ruling: चरण B मालिक के Supabase खाते के इंतज़ार में है; यह काम बिना खाते के, सीधे North Star #2 (ठगी से पहले रोकना) से जुड़ा है।]**

## Global Constraints
- पन्ने: `bijli-bill` (turant: `customer-care-fake`, क्योंकि ऐप डलवाना + पैसे जाना), `lottery-inaam` (turant: `upi`), `sextortion` (turant: `sextortion`), `loan-app` (turant: `loan-app`)।
- हर पन्ना: 3 लाइन सार, ≥4 "कैसे होती है", 5 निशान, ≥2 उदाहरण (बिना असली नंबर/नाम), 3 नियम, ≥2 FAQ, description ≤160।
- हर उदाहरण पर checker `danger` दे (सुनहरा test-set इन्हें अपने आप पढ़ता है)।
- checker: `electricity_cut → bijli-bill`, `lottery_fee → lottery-inaam`, `blackmail → sextortion`, `loan_threat → loan-app`।
- sextortion पन्ने में Tele-MANAS 14416 का ज़िक्र, और "यह आपकी गलती नहीं है"।
- मना किए शब्द नहीं (copy-lint)।

### Task 1: tests (RED)
- [ ] gyan.test: 9 पन्ने तय क्रम में · नए पन्नों के `turantSlug` · `gyanForTurant("customer-care-fake")` में `bijli-bill` भी
- [ ] checker: ऊपर वाले 4 निशानों का `gyan` · हर निशान का `gyan` असली पन्ना हो
- [ ] routes: 39 → 43

### Task 2: 4 पन्ने + registry + GyanSlug (GREEN) → commit

### Task 3: browser जाँच
- [ ] e2e-gyan: नए 4 पन्ने खुलें, 5 निशान, 320px पर बगल में scroll नहीं · /turant/sextortion से "विस्तार से" link → commit
