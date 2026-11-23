import type { Metadata } from "next";
import Link from "next/link";
import { IconExternal, IconPhone } from "@/components/ui/icons";
import { Notice } from "@/components/ui/notice";
import { HELPLINES, HELP_SITES } from "@/modules/site/helplines";
import { pageMeta } from "@/modules/site/meta";

export const metadata: Metadata = pageMeta({
  title: "ज़रूरी नंबर और साइटें",
  description: "ठगी के बाद एक tap में call: साइबर ठगी 1930, पुलिस 112, महिला हेल्पलाइन 181, RBI 14448, आधार 1947, Tele-MANAS 14416, और ज़रूरी सरकारी साइटें।",
  path: "/nambar",
});

// ज़रूरी नंबर (TR-31): हर नंबर एक tap में, offline भी। नंबरों के मूल स्रोत modules/site/helplines.ts में।
export default function NambarPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold leading-snug">ज़रूरी नंबर और साइटें</h1>
      <p>नंबर दबाएँ, call लग जाएगी। ये सब मुफ़्त हैं।</p>
      <ul className="space-y-2">
        {HELPLINES.map((h, i) => (
          <li key={h.number}>
            <a
              href={`tel:${h.number}`}
              className={`flex min-h-12 items-center gap-3 rounded-xl border-2 px-4 py-3 no-underline ${
                i === 0 ? "border-danger bg-danger-bg text-danger" : "border-line bg-paper text-ink"
              }`}
            >
              <IconPhone className="h-6 w-6 shrink-0" />
              <span className="min-w-0">
                <span className="block text-[22px] font-extrabold leading-tight">{h.number}</span>
                <span className="block font-bold leading-snug">{h.titleHi}</span>
                <span className={`block text-[15px] leading-snug ${i === 0 ? "" : "text-muted"}`}>{h.whenHi}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <Notice tone="warn">कोई ख़ुद को 1930, पुलिस, RBI या बैंक का बताकर call करे और OTP, PIN या पैसे माँगे, तो वह ठग है। नंबर हमेशा ख़ुद मिलाएँ।</Notice>

      <section aria-labelledby="apna-bank" className="space-y-2 rounded-xl border border-line bg-paper p-3">
        <h2 id="apna-bank" className="text-[19px] font-bold">
          अपने बैंक का नंबर
        </h2>
        <p>card के पीछे, passbook में, या बैंक के अपने ऐप में लिखा नंबर ही लगाएँ। Google पर न खोजें, वहाँ नकली नंबर भी होते हैं।</p>
        <Link href="/gyan/bank" className="flex min-h-12 items-center font-semibold text-brand">
          अपने बैंक को ठगी कैसे बताएँ →
        </Link>
      </section>

      <section aria-labelledby="sites" className="space-y-2">
        <h2 id="sites" className="text-[19px] font-bold">
          ज़रूरी सरकारी साइटें
        </h2>
        <ul className="space-y-2">
          {HELP_SITES.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-start gap-2 rounded-xl border border-line bg-paper px-4 py-3 text-ink no-underline"
              >
                <span className="min-w-0">
                  <span className="block font-bold text-brand">{s.labelHi}</span>
                  <span className="block text-[15px] leading-snug">{s.whenHi}</span>
                </span>
                <IconExternal className="mt-1 h-4 w-4 shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Link href="/turant" className="flex min-h-12 items-center font-semibold text-brand">
        ठगी अभी हुई है? पहले 60 मिनट के कदम →
      </Link>
    </div>
  );
}
