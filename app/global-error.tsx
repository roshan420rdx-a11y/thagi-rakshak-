"use client";

// root layout भी टूट जाए, तब का पन्ना: अपना <html>, और साइट की CSS के बिना भी पढ़ने लायक (inline style; CSP में
// style-src 'unsafe-inline' है)। रंग वही जो design tokens (light) में हैं, ताकि contrast पक्का रहे।
const FONT = '"Noto Sans Devanagari", "Nirmala UI", system-ui, sans-serif';
const BUTTON = {
  display: "inline-block",
  minHeight: 48,
  padding: "12px 16px",
  borderRadius: 10,
  fontWeight: 700,
  fontSize: 18,
  textDecoration: "none",
  fontFamily: FONT,
} as const;

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="hi">
      <body style={{ margin: 0, fontFamily: FONT, fontSize: 18, lineHeight: 1.6, background: "#FFFFFF", color: "#101828" }}>
        <main id="main" style={{ maxWidth: 680, margin: "0 auto", padding: "32px 16px" }}>
          <h1 style={{ fontSize: 22 }}>कुछ गड़बड़ हो गई</h1>
          <p>यह हमारी तरफ़ की गलती है, आपकी नहीं। एक बार फिर कोशिश करें।</p>
          <p>
            <button type="button" onClick={reset} style={{ ...BUTTON, border: "1px solid #1D3A6B", background: "#FFFFFF", color: "#1D3A6B" }}>
              फिर से कोशिश करें
            </button>
          </p>
          <p style={{ fontWeight: 700 }}>ठगी हो गई है, तो रुकें नहीं:</p>
          <p>
            <a href="tel:1930" style={{ ...BUTTON, background: "#B42318", color: "#FFFFFF" }}>
              1930 मिलाएँ
            </a>
          </p>
          <p>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- टूटी हालत में पूरा पन्ना नए सिरे से खुले */}
            <a href="/turant" style={{ ...BUTTON, background: "#B42318", color: "#FFFFFF" }}>
              ठगी हो गई? अभी क्या करें
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
