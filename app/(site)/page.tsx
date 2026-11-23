import type { Metadata } from "next";
import { BigDoor } from "@/components/ui/big-door";
import { IconAlert, IconSearch } from "@/components/ui/icons";
import Link from "next/link";
import { HomeCaseCard } from "@/components/case/home-case-card";
import { InstallButton } from "@/components/site/install-button";
import { whatsappShareLink } from "@/modules/checker/share";
import { absoluteUrl, getSiteConfig, whatsappLink } from "@/modules/site";
import { pageMeta } from "@/modules/site/meta";

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
] as const;

// प्रतिज्ञा footer में हर पन्ने पर है (और छोटे होम पर पहली screen में ही दिखती है), इसलिए यहाँ दोबारा नहीं
export default function HomePage() {
  const { whatsappNumber, siteUrl } = getSiteConfig();
  return (
    <div className="space-y-4">
      <h1 className="sr-only">ठगी रक्षक: डिजिटल ठगी में मदद</h1>
      <HomeCaseCard />
      <BigDoor
        href="/turant"
        title="मेरे साथ ठगी हो गई"
        subtitle="अभी मदद पाएँ · मुफ़्त · बिना login"
        tone="danger"
        icon={<IconAlert className="h-8 w-8" />}
      />
      <BigDoor
        href="/pucho"
        title="यह call या message ठगी है?"
        subtitle="message चिपकाकर जाँचें · मुफ़्त"
        tone="safe"
        icon={<IconSearch className="h-8 w-8" />}
      />
      <section aria-labelledby="aur-madad" className="space-y-2">
        <h2 id="aur-madad" className="text-[19px] font-bold">
          और मदद
        </h2>
        <ul className="grid grid-cols-2 gap-2">
          {TILES.map((t) => (
            <li key={t.href}>
              <Link href={t.href} className="flex h-full min-h-[88px] flex-col justify-center rounded-xl border border-line bg-paper p-3 no-underline">
                <span className="block text-[17px] font-bold leading-snug text-brand">{t.title}</span>
                <span className="block text-[14px] leading-snug text-muted">{t.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
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
        className="flex min-h-12 items-center justify-center rounded-xl border border-line bg-paper px-4 font-semibold text-ink no-underline"
      >
        यह साइट अपने लोगों को भेजें (WhatsApp)
      </a>
      <InstallButton />
    </div>
  );
}
