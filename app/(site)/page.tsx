import type { Metadata } from "next";
import { BigDoor } from "@/components/ui/big-door";
import { Call1930Strip } from "@/components/ui/call-1930-strip";
import { IconAlert, IconCheck, IconPhone, IconSearch } from "@/components/ui/icons";
import Link from "next/link";
import { HomeCaseCard } from "@/components/case/home-case-card";
import { HomeProgress } from "@/components/turant/home-progress";
import { TURANT_SLUGS, getTurantPage } from "@/modules/scams";
import { InstallButton } from "@/components/site/install-button";
import { whatsappShareLink } from "@/modules/checker/share";
import { absoluteUrl, getSiteConfig, whatsappLink } from "@/modules/site";
import { pageMeta, siteJsonLd } from "@/modules/site/meta";
import { buildSiteIndex } from "@/modules/site/search";
import { SiteSearch } from "@/components/site/site-search";

export const metadata: Metadata = pageMeta({
  fullTitle: "ठगी रक्षक: डिजिटल ठगी हो गई? अभी क्या करें",
  description:
    "डिजिटल ठगी हो गई? पहले 60 मिनट में क्या करें, RBI के नियमों से आपका हक़, और ठगी पहचानने की मुफ़्त जाँच। आसान हिंदी में।",
  path: "/",
});

// होम की "और मदद": हर बड़ी सुविधा एक tile (बड़े दरवाज़ों के नीचे)
const TILES = [
  { href: "/case", title: "मेरा केस", body: "शिकायतों का हिसाब, आगे की तारीख़ें" },
  { href: "/arzi", title: "अर्ज़ियाँ", body: "बैंक, पुलिस, RBI के पत्र" },
  { href: "/shikayat-rasta", title: "शिकायत का रास्ता", body: "1930 से RBI Ombudsman तक" },
  { href: "/haq", title: "आपका हक़", body: "RBI के नियमों से हिसाब" },
  { href: "/gyan/bank", title: "अपना बैंक", body: "बैंक को ठगी कैसे बताएँ" },
  { href: "/gyan", title: "ज्ञानकोश", body: "ठगी कैसे होती है, कैसे बचें" },
  { href: "/abhyas", title: "ठगी या असली?", body: "8 message पहचानने का अभ्यास" },
  { href: "/poster", title: "पोस्टर छापें", body: "दुकान, बैंक, पंचायत में लगाएँ" },
] as const;

// भरोसे की बातें: सब सच (कोई खाता नहीं, कोई पैसा नहीं, "मेरा केस" सिर्फ़ इसी फ़ोन/browser में)
const TRUST = ["मुफ़्त", "बिना login", "आपकी जानकारी आपके फ़ोन में"] as const;

// प्रतिज्ञा footer में हर पन्ने पर है, इसलिए यहाँ दोबारा नहीं।
// फ़ोन पर क्रम: शीर्षक → ठगी हो गई → 1930 → बाकी नंबर → पहले पूछो। desktop पर दो कॉलम (data-wide: पन्ना 1040px चौड़ा)।
export default function HomePage() {
  const { whatsappNumber, siteUrl } = getSiteConfig();
  return (
    <div data-wide className="space-y-5 md:space-y-7">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd(siteUrl)).replace(/</g, "\\u003c") }} />
      <section aria-labelledby="home-title" className="rounded-2xl border border-line bg-paper px-4 py-5 md:px-8 md:py-7">
        <h1 id="home-title" className="text-[24px] font-bold leading-snug md:text-[32px]">
          डिजिटल ठगी हो गई, या शक है?
        </h1>
        <p className="mt-1 text-[16px] text-muted md:text-[18px]">
          अभी क्या करें, किसे बताएँ, और आपका हक़ क्या है: आसान हिंदी में।
          <span className="hidden sm:inline"> हर कदम पर सही सरकारी और बैंक रास्ते।</span>
        </p>
        <ul aria-label="भरोसे की बातें" className="mt-3 flex flex-wrap items-center gap-2">
          {TRUST.map((t) => (
            <li key={t} className="inline-flex items-center gap-1.5 rounded-full bg-brand-bg px-3 py-1 text-[14px] font-semibold text-brand">
              <IconCheck className="h-4 w-4" />
              {t}
            </li>
          ))}
          <li className="hidden md:block">
            <Link href="/bharosa" className="ml-1 text-[15px] font-semibold text-brand">
              हम कौन हैं →
            </Link>
          </li>
        </ul>
      </section>
      <HomeCaseCard />
      <HomeProgress pages={TURANT_SLUGS.map((s) => ({ slug: s, titleHi: getTurantPage(s).titleHi, stepIds: getTurantPage(s).steps.map((x) => x.id) }))} />
      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        <div className="md:col-start-1 md:row-start-1">
          <BigDoor
            href="/turant"
            title="मेरे साथ ठगी हो गई"
            subtitle="अभी क्या करें: कदम-दर-कदम"
            tone="danger"
            icon={<IconAlert className="h-8 w-8" />}
          />
        </div>
        {/* plan A2d: होम से ही एक tap (पहले /turant से होकर दो tap) */}
        <div className="md:col-start-1 md:row-start-2">
          <Call1930Strip />
        </div>
        <div className="md:col-start-2 md:row-start-2">
          <Link
            href="/nambar"
            className="flex h-full min-h-12 items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 no-underline transition-colors hover:border-brand"
          >
            <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-bg text-brand">
              <IconPhone className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-[17px] font-bold leading-snug text-brand">बाकी ज़रूरी नंबर →</span>
              <span className="block text-[15px] leading-snug text-muted">पुलिस, महिला, RBI, आधार</span>
            </span>
          </Link>
        </div>
        <div className="md:col-start-2 md:row-start-1">
          <BigDoor
            href="/pucho"
            title="यह call या message ठगी है?"
            subtitle="message चिपकाएँ, screenshot दें, या बोलकर बताएँ · मुफ़्त"
            tone="brand"
            icon={<IconSearch className="h-8 w-8" />}
          />
        </div>
      </div>
      {/* plan A2f: "क्या ढूँढ रहे हैं?" (बिना JS के नहीं दिखता; तब footer का "पूरी साइट में खोजें" पूरी सूची देता है) */}
      <SiteSearch index={buildSiteIndex()} className="rounded-2xl border border-line bg-paper p-4 md:p-5" />
      <section aria-labelledby="aur-madad" className="space-y-2">
        <h2 id="aur-madad" className="text-[19px] font-bold">
          और मदद
        </h2>
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {TILES.map((t) => (
            <li key={t.href}>
              <Link
                href={t.href}
                className="flex h-full min-h-[88px] flex-col justify-center rounded-xl border border-line bg-paper p-3 no-underline transition-colors hover:border-brand md:p-4"
              >
                <span className="block text-[17px] font-bold leading-snug text-brand">{t.title}</span>
                <span className="block text-[14px] leading-snug text-muted">{t.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <div className="flex flex-col gap-2 md:flex-row md:*:flex-1">
        {whatsappNumber ? (
          <a
            href={whatsappLink(whatsappNumber, "नमस्ते, मुझे ठगी से जुड़ी मदद चाहिए")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center rounded-xl bg-safe px-4 font-bold text-on-safe no-underline"
          >
            WhatsApp पर बात करें
          </a>
        ) : null}
        <a
          href={whatsappShareLink(`ठगी से बचने के लिए, और ठगी हो जाए तो क्या करें (मुफ़्त): ${absoluteUrl("/", siteUrl)}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center rounded-xl border border-line bg-paper px-4 font-semibold text-ink no-underline transition-colors hover:border-brand"
        >
          यह साइट अपने लोगों को भेजें (WhatsApp)
        </a>
        <InstallButton />
      </div>
    </div>
  );
}
