import type { Metadata } from "next";
import { pageMeta } from "@/modules/site/meta";
import { TurantSteps } from "@/components/turant/turant-steps";
import { ActionLink } from "@/components/ui/action-link";
import { TURANT_SLUGS, getTurantPage } from "@/modules/scams";
import Link from "next/link";

export const metadata: Metadata = pageMeta({
  title: "ठगी हो गई? अभी क्या करें",
  description:
    "डिजिटल ठगी हो गई? घबराइए नहीं। UPI, card, digital arrest, loan ऐप: हर तरह की ठगी के बाद अभी क्या करें। मुफ़्त, बिना login, internet के बिना भी।",
  path: "/turant",
});

export default function TurantIndex() {
  const types = TURANT_SLUGS.filter((s) => s !== "pata-nahi");
  return (
    <>
      <h1 className="text-[22px] font-bold md:text-[28px] leading-snug">घबराइए नहीं। क्या हुआ?</h1>
      {/* प्रकार चुनने से पहले ही: पैसे गए हों तो पहला कदम हर प्रकार में 1930 है (DISHA: 3 सेकंड में अगला कदम) */}
      <div className="mt-3 space-y-2 rounded-xl border-2 border-danger bg-danger-bg p-3">
        <p className="font-bold text-danger">पैसे गए हैं? सबसे पहले 1930 पर call करें, फिर नीचे अपना प्रकार चुनें।</p>
        <ActionLink action={{ kind: "tel", number: "1930", labelHi: "1930 मिलाएँ" }} primary />
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {types.map((slug) => (
          <li key={slug}>
            <Link
              href={`/turant/${slug}`}
              className="flex min-h-12 items-center rounded-xl border border-line bg-paper px-4 py-2 font-semibold text-ink no-underline"
            >
              {getTurantPage(slug).titleHi}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mt-6 mb-3 text-[19px] font-bold">पता नहीं? ये काम अभी करें</h2>
      <TurantSteps page={getTurantPage("pata-nahi")} headingLevel={3} />
    </>
  );
}
