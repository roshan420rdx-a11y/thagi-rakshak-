import type { Metadata } from "next";
import Link from "next/link";
import { BigDoor } from "@/components/ui/big-door";
import { IconAlert } from "@/components/ui/icons";
import { Notice } from "@/components/ui/notice";
import { SCAM_SIGNS } from "@/modules/site";

export const metadata: Metadata = { title: "ठगी के 7 आम निशान — ठगी रक्षक" };

// checker (screenshot भेजकर पूछना) TR-23 से TR-25 में आएगा; तब तक यह पन्ना आम निशान सिखाता है
export default function PuchoPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold leading-snug">ठगी के 7 आम निशान</h1>
      <p>इनमें से एक भी दिखे, तो रुकें। पैसे न भेजें, कोई ऐप न डालें।</p>
      <ol className="space-y-3">
        {SCAM_SIGNS.map((s, i) => (
          <li key={s.titleHi} className="rounded-xl border border-line bg-paper p-3">
            <h2 className="text-[17px] font-bold leading-snug">
              {i + 1}. {s.titleHi}
            </h2>
            <p className="mt-1">{s.bodyHi}</p>
          </li>
        ))}
      </ol>
      <Notice tone="info">screenshot भेजकर पूछने वाली सुविधा जल्द आ रही है।</Notice>
      <BigDoor
        href="/turant"
        title="पैसे जा चुके हैं?"
        subtitle="अभी क्या करें, देखें"
        tone="danger"
        icon={<IconAlert className="h-8 w-8" />}
      />
      <Link href="/gyan" className="flex min-h-12 items-center font-semibold text-brand">
        ठगी के प्रकार विस्तार से: ज्ञानकोश →
      </Link>
    </div>
  );
}
