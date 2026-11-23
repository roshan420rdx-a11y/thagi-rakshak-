import type { Metadata } from "next";
import { PrintButton } from "@/components/ui/print-button";
import { whatsappShareLink } from "@/modules/checker/share";
import { absoluteUrl, getSiteConfig } from "@/modules/site";
import { POSTER_HELP, POSTER_RULES, posterHost } from "@/modules/site/poster";
import { pageMeta } from "@/modules/site/meta";

export const metadata: Metadata = pageMeta({
  title: "ठगी से बचाव का पोस्टर (छापें या भेजें)",
  description:
    "एक पन्ने का मुफ़्त पोस्टर: ठगी से बचने की 8 बातें और ठगी हो जाए तो 1930। छापकर दुकान, बैंक, पंचायत या स्कूल में लगाएँ, या PDF बनाकर भेजें।",
  path: "/poster",
});

// पोस्टर (plan A3g)। print में सिर्फ़ [data-print-area] छपता है (globals.css), A4 के एक पन्ने पर (e2e)।
// QR code नहीं (हम "QR scan न करें" सिखाते हैं); साइट का पता बड़े अक्षरों में।
export default function PosterPage() {
  const { siteUrl } = getSiteConfig();
  const host = posterHost(siteUrl);
  const [before, after] = POSTER_HELP[0].split("1930");
  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold md:text-[28px] leading-snug">ठगी से बचाव का पोस्टर</h1>
      <p>छापकर दुकान, बैंक, पंचायत भवन या स्कूल में लगाएँ, या PDF बनाकर WhatsApp पर भेजें। मुफ़्त है, जितना चाहें छापें।</p>

      <article
        id="poster-print"
        data-print-area="poster"
        className="space-y-4 rounded-xl border-2 border-brand bg-paper p-4 text-ink print:space-y-[11pt]"
      >
        <header className="text-center">
          <p className="text-[30px] font-extrabold leading-tight text-danger print:text-[40pt]">ठगी से बचें</p>
          <p className="text-[17px] font-bold print:text-[17pt]">ये 8 बातें हमेशा याद रखें</p>
        </header>
        <ol className="space-y-3 print:space-y-[7pt]">
          {POSTER_RULES.map((r, i) => (
            <li key={r} data-poster-rule className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-paper print:h-[23pt] print:w-[23pt] print:text-[13pt]"
              >
                {i + 1}
              </span>
              <span className="font-semibold leading-snug print:text-[14.5pt]">{r}</span>
            </li>
          ))}
        </ol>
        <div className="space-y-1 rounded-xl border-4 border-danger bg-danger-bg p-3 text-center print:p-[10pt]">
          <p className="font-bold text-danger print:text-[16pt]">
            {before.trim()}
            <span className="block text-[46px] font-extrabold leading-none print:text-[56pt]">1930</span>
            {after.trim()}
          </p>
          {POSTER_HELP.slice(1).map((l) => (
            <p key={l} className="font-semibold print:text-[14pt]">
              {l}
            </p>
          ))}
        </div>
        <footer className="space-y-1 text-center">
          <p className="font-bold print:text-[14pt]">
            मुफ़्त मदद, आसान हिंदी में: <span className="break-all text-brand">{host}</span>
          </p>
          <p className="text-[13px] text-muted print:text-[11pt]">ठगी रक्षक (सरकारी संस्था नहीं)। हम कभी OTP, PIN या पैसे नहीं माँगते।</p>
        </footer>
      </article>

      <PrintButton />
      <p className="text-[14px] text-muted">फ़ोन पर: Print खुलने पर printer की जगह &quot;Save as PDF&quot; चुनें; PDF फ़ोन में सेव होगी, उसे WhatsApp पर भी भेज सकते हैं।</p>
      <a
        href={whatsappShareLink(`ठगी से बचाव का मुफ़्त पोस्टर, छापकर लगाएँ: ${absoluteUrl("/poster", siteUrl)}`)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-12 items-center justify-center rounded-xl border border-line bg-paper px-4 font-semibold text-ink no-underline transition-colors hover:border-brand"
      >
        पोस्टर का link WhatsApp पर भेजें
      </a>
    </div>
  );
}
