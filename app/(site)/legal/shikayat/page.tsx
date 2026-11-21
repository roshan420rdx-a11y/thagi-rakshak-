import type { Metadata } from "next";
import Link from "next/link";
import { DraftBanner } from "@/components/legal/draft-banner";
import { Notice } from "@/components/ui/notice";
import { getSiteConfig } from "@/modules/site";

export const metadata: Metadata = { title: "शिकायत अधिकारी — ठगी रक्षक" };

export default function ShikayatPage() {
  const { orgName, grievanceName, grievanceEmail } = getSiteConfig();
  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold leading-snug">शिकायत अधिकारी</h1>
      <Notice tone="danger">
        ठगी की शिकायत यहाँ नहीं होती। ठगी हुई है तो तुरंत 1930 पर call करें, या cybercrime.gov.in पर शिकायत करें।{" "}
        <Link href="/turant" className="underline">
          अभी क्या करें, देखें
        </Link>
      </Notice>
      <DraftBanner />
      <p>हमारी सेवा के बारे में शिकायत हो (जैसे कोई ग़लत जानकारी, या आपकी जानकारी से जुड़ा सवाल), तो यहाँ लिखें।</p>
      <dl className="space-y-2 rounded-xl border border-line bg-paper p-3">
        <div>
          <dt className="text-muted">सेवा चलाने वाले</dt>
          <dd className="font-semibold">{orgName ?? "जल्द जोड़ा जाएगा"}</dd>
        </div>
        <div>
          <dt className="text-muted">शिकायत अधिकारी:</dt>
          <dd className="font-semibold">
            {grievanceName && grievanceEmail ? (
              <>
                {grievanceName} ·{" "}
                <a href={`mailto:${grievanceEmail}`} className="text-brand">
                  {grievanceEmail}
                </a>
              </>
            ) : (
              "अभी नियुक्त नहीं; launch से पहले यहाँ नाम और email जुड़ेंगे।"
            )}
          </dd>
        </div>
        <div>
          <dt className="text-muted">जवाब का समय</dt>
          <dd className="font-semibold">[वकील की जाँच के बाद तय होगा]</dd>
        </div>
      </dl>
    </div>
  );
}
