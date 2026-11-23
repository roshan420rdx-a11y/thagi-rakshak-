# तस्वीरें कैसे बनीं

- `public/og-image.png` (WhatsApp/Facebook preview, 1200×630): `og-image-template.html` को Chromium में 1200×630 पर खोलकर screenshot।
  अक्षर: Noto Sans Devanagari (`@fontsource/noto-sans-devanagari`, सिर्फ़ तस्वीर बनाने के लिए; साइट की dependency नहीं)।
  बदलनी हो तो: template में बदलाव → font files `fonts/` में रखें → 1200×630 screenshot → `public/og-image.png` (300KB से छोटी; e2e-seo जाँचता है)।
