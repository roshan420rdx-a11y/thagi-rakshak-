# Plan A3e: ज्ञानकोश के 3 और पन्ने ("पहले पूछो" के बिना-पन्ने वाले निशान)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans

**Goal:** checker के जिन निशानों का कोई ज्ञानकोश पन्ना नहीं था, उनके लिए पन्ने, ताकि नतीजे से "इस ठगी के बारे में पढ़ें" मिले:
- `kyc-link`: KYC/PAN/खाता बंद होने का डर + नकली link (निशान `kyc_block`, `bank_lookalike`), turant `netbanking`
- `apna-bankar`: किसी अपने के नाम से "नया नंबर, पैसे भेजो" (निशान `new_number` + नया danger `new_number_money`), turant `upi`
- `galti-se-paise`: "गलती से पैसे भेज दिए, वापस करो" (निशान `wrong_transfer`), turant `upi`
- `loan_advance_fee` → मौजूदा `loan-app` पन्ना, उसमें "loan से पहले fee" का एक सवाल-जवाब

**Global Constraints**
- plan A3b वाला ढाँचा (3 लाइन सार, ≥4 कैसे, 5 निशान, ≥2 उदाहरण, 3 नियम, ≥2 FAQ, description ≤160, `reviewer: null`)।
- हर उदाहरण पर checker danger दे (सुनहरा test-set इन्हें अपने आप पढ़ता है)।
- RBI की बात सिर्फ़ मूल text वाले quote से (`.bank.in`: RBI_BANK_IN)। कोई आँकड़ा या वादा नहीं।
- `new_number` (सिर्फ़ नंबर बदलने की बात) warn ही रहे; पैसे माँगने के साथ हो तभी danger।

### Task 1: tests (RED): 12 पन्ने, नए turant, checker के gyan links, नया नियम, routes 43 → 46
### Task 2: 3 पन्ने + loan-app का FAQ + registry + checker (GREEN) → commit
### Task 3: e2e-gyan (12 पन्ने), जवाब-किताब में तीन नए जवाब → commit
