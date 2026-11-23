import type { Metadata } from "next";
import Link from "next/link";
import { MeraCase } from "@/components/case/mera-case";
import { pageMeta } from "@/modules/site/meta";

export const metadata: Metadata = pageMeta({
  title: "मेरा केस",
  description:
    "अपनी ठगी की शिकायतों का हिसाब: 1930, cybercrime.gov.in, बैंक, पुलिस और RBI Ombudsman के शिकायत नंबर, और आगे की तारीख़ें। सब सिर्फ़ आपके फ़ोन में।",
  path: "/case",
});

// "मेरा केस" फ़ोन के अंदर (plan B0)। सारा data browser में; यह पन्ना ख़ुद कुछ नहीं जानता।
export default function CasePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold md:text-[28px] leading-snug">मेरा केस</h1>
      <p>ठगी के बाद हर जगह की शिकायत, उसका नंबर, और आगे की ज़रूरी तारीख़ें, एक जगह।</p>
      <noscript>
        <p className="rounded-xl border-2 border-warn bg-warn-bg p-3 font-semibold text-warn">
          यह सुविधा JavaScript से चलती है। तब तक हर शिकायत का नंबर और तारीख़ काग़ज़ पर लिखें।
        </p>
      </noscript>
      <MeraCase />
      <Link href="/shikayat-rasta" className="flex min-h-12 items-center font-semibold text-brand">
        शिकायत कहाँ और कैसे करें: पूरा रास्ता →
      </Link>
    </div>
  );
}
