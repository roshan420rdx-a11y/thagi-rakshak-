import Link from "next/link";
import { TrustBar } from "./trust-bar";

// हर पन्ने के नीचे: प्रतिज्ञा, तीन हिस्सों में सारे links (हर link एक ही बार), और हम कौन हैं / कौन नहीं
const COLUMNS = [
  {
    titleHi: "मदद",
    links: [
      { href: "/turant", labelHi: "ठगी हो गई: अभी क्या करें" },
      { href: "/pucho", labelHi: "पहले पूछो: message की जाँच" },
      { href: "/shikayat-rasta", labelHi: "शिकायत का रास्ता" },
      { href: "/arzi", labelHi: "अर्ज़ियाँ (बैंक, पुलिस, RBI)" },
      { href: "/nambar", labelHi: "ज़रूरी नंबर: 1930 · 112 · 181 · 14448" },
    ],
  },
  {
    titleHi: "जानकारी",
    links: [
      { href: "/gyan", labelHi: "ज्ञानकोश: ठगी के तरीके" },
      { href: "/haq", labelHi: "आपका हक़ (RBI के नियम)" },
      { href: "/gyan/bank", labelHi: "अपने बैंक से संपर्क" },
      { href: "/abhyas", labelHi: "ठगी या असली? अभ्यास" },
      { href: "/poster", labelHi: "पोस्टर छापें" },
    ],
  },
  {
    titleHi: "हमारे बारे में",
    links: [
      { href: "/bharosa", labelHi: "भरोसा: हम कौन हैं" },
      { href: "/legal/privacy", labelHi: "निजता (privacy)" },
      { href: "/legal/terms", labelHi: "शर्तें" },
      { href: "/legal/shikayat", labelHi: "शिकायत अधिकारी" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-line bg-paper pb-24 md:pb-0">
      <div className="mx-auto max-w-[1040px] px-4 py-8">
        <TrustBar />
        <nav aria-label="साइट के सारे हिस्से" className="mt-6 grid gap-6 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.titleHi}>
              <h2 className="text-[15px] font-bold text-ink">{col.titleHi}</h2>
              <ul className="mt-1">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-11 items-center md:min-h-9 text-[15px] text-brand no-underline hover:underline">
                      {l.labelHi}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mt-6 space-y-1 border-t border-line pt-4 text-[14px] text-muted">
          <p>
            <span className="font-bold text-ink">ठगी रक्षक</span> · स्वतंत्र, मुफ़्त सेवा
          </p>
          <p>यह सरकारी वेबसाइट नहीं है। हम आपको सरकारी और बैंक के सही रास्तों तक पहुँचाने में मदद करते हैं।</p>
          <p>यहाँ दी गई जानकारी कानूनी सलाह नहीं है।</p>
        </div>
      </div>
    </footer>
  );
}
