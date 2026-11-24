import type { Metadata } from "next";
import Link from "next/link";
import { ArziBuilder } from "@/components/arzi/arzi-builder";
import { pageMeta } from "@/modules/site/meta";

export const metadata: Metadata = pageMeta({
  title: "अर्ज़ियाँ: बैंक, पुलिस और RBI के लिए पत्र",
  description:
    "ठगी के बाद बैंक शाखा, थाने या cyber cell, और RBI Ombudsman के लिए तैयार पत्र, हिंदी या English में। जानकारी भरें, फ़ोन से Print या PDF करें। मुफ़्त।",
  path: "/arzi",
});

// मुफ़्त अर्ज़ियाँ (plan B1): सब फ़ोन में बनता है।
export default function ArziPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold md:text-[28px] leading-snug">अर्ज़ियाँ: बैंक, पुलिस और RBI के लिए पत्र</h1>
      <noscript>
        <p className="rounded-xl border-2 border-warn bg-warn-bg p-3 font-semibold text-warn">
          यह सुविधा JavaScript से चलती है। तब तक &quot;शिकायत का पूरा रास्ता&quot; में दिया नमूना email काम में लें।
        </p>
      </noscript>
      <ArziBuilder />
      <Link href="/shikayat-rasta" className="flex min-h-12 items-center font-semibold text-brand">
        शिकायत कहाँ और कैसे करें: पूरा रास्ता →
      </Link>
    </div>
  );
}
