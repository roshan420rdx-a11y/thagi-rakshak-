import type { Metadata } from "next";
import { BigDoor } from "@/components/ui/big-door";
import { IconAlert, IconSearch } from "@/components/ui/icons";
import Link from "next/link";
import { getSiteConfig, whatsappLink } from "@/modules/site";
import { pageMeta } from "@/modules/site/meta";

export const metadata: Metadata = pageMeta({
  fullTitle: "ठगी रक्षक: डिजिटल ठगी हो गई? अभी क्या करें",
  description:
    "डिजिटल ठगी हो गई? पहले 60 मिनट में क्या करें, RBI के नियमों से आपका हक़, और ठगी पहचानने की मुफ़्त जाँच। आसान हिंदी में।",
  path: "/",
});

// प्रतिज्ञा footer में हर पन्ने पर है (और छोटे होम पर पहली screen में ही दिखती है), इसलिए यहाँ दोबारा नहीं
export default function HomePage() {
  const { whatsappNumber } = getSiteConfig();
  return (
    <div className="space-y-4">
      <h1 className="sr-only">ठगी रक्षक: डिजिटल ठगी में मदद</h1>
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
      <Link href="/haq" className="flex min-h-12 items-center rounded-xl border border-line bg-paper px-4 font-semibold text-brand no-underline">
        अपना हक़ जानें: RBI के नियमों से हिसाब →
      </Link>
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
    </div>
  );
}
