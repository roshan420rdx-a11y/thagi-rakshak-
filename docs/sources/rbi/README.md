# RBI के मूल स्रोत (नियम-तालिका के लिए)

ये फ़ाइलें RBI की वेबसाइट से सीधे पढ़े गए मूल text के अंश हैं (Ombudsman वाली फ़ाइल `rbios2026.ombudsmanWindow` नियम और `/shikayat-rasta` पन्ने का आधार है), जिनमें कोई बदलाव नहीं किया गया। rules engine (`modules/rules-engine`) का हर नियम इन्हीं में से किसी paragraph का हवाला देता है।

| फ़ाइल | किस पर लागू |
|---|---|
| `2026-06-24-commercial-banks-rbc-third-amendment.txt` | 1 जनवरी 2027 या उसके बाद के लेन-देन (ठगी की परिभाषा, ज़िम्मेदारी, 45 दिन, ₹25,000 मुआवज़ा) |
| `2025-commercial-banks-rbc-directions-paras-67-73.txt` | 1 जनवरी 2027 से पहले के लेन-देन (3/7 कार्य-दिवस, Table 1, 10 दिन, 90 दिन) |
| `2019-09-20-tat-failed-transactions.txt` | fail हुए लेन-देन (ठगी नहीं): T+1 / T+5, ₹100 रोज़ |
| `2025-04-22-bank-in-domain.txt` | बैंकों की वेबसाइट `.bank.in` पर (31 अक्टूबर 2025 तक): commercial, urban co-operative, state और district co-operative banks |
| `2026-07-01-rbios-2026-faq.txt` | RBI Ombudsman (RB-IOS 2026, 1 जुलाई 2026 से): पहले बैंक, 30 दिन (या ज़्यादा तय समय), फिर 90 दिन के अंदर; मुफ़्त; cms.rbi.org.in, 14448; मुआवज़े की सीमा। RBI का अपना FAQ पन्ना (scheme का PDF rbidocs host पर है, जो इस environment से नहीं खुलता) |

**सातों तरह के बैंकों के लिए अलग-अलग directions हैं,** और सबमें यही नियम हैं (2026-11-21 को हर एक में "85 per cent", "₹50,000", "five calendar days", "45 calendar days", "coercion or duress", "one year from the effective date", "January 1, 2027" मिलाकर जाँचा):

| बैंक का प्रकार | RBI notification Id |
|---|---|
| Commercial Banks | 13543 |
| Small Finance Banks | 13544 |
| Payments Banks | 13545 |
| Local Area Banks | 13546 |
| Regional Rural Banks | 13547 |
| Urban Co-operative Banks | 13548 |
| Rural Co-operative Banks | 13549 |

URL का रूप: `https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=<Id>&Mode=0` · press release: `https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=63011` (24 जून 2026)

**दूसरी जाँच (👤 मालिक):** हर नियम live होने से पहले कोई दूसरा इंसान ऊपर के link खोलकर मिलाए, कि नियम में दिया paragraph सच में वही कहता है।
