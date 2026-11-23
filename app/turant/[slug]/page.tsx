import type { Metadata } from "next";
import { TURANT_DESCRIPTIONS, pageMeta } from "@/modules/site/meta";
import { notFound } from "next/navigation";
import Link from "next/link";
import { KabChips } from "@/components/turant/kab-chips";
import { TurantSteps } from "@/components/turant/turant-steps";
import { gyanForTurant } from "@/modules/gyan";
import { TURANT_SLUGS, asksWhen, getTurantPage, isTurantSlug } from "@/modules/scams";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return TURANT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isTurantSlug(slug)) return {};
  return pageMeta({ title: `${getTurantPage(slug).titleHi}: अभी क्या करें`, description: TURANT_DESCRIPTIONS[slug], path: `/turant/${slug}` });
}

export default async function TurantPageRoute({ params }: Props) {
  const { slug } = await params;
  if (!isTurantSlug(slug)) notFound();
  const page = getTurantPage(slug);
  return (
    <>
      <h1 className="text-[22px] font-bold md:text-[28px] leading-snug">ये काम अभी करें</h1>
      <p className="mb-3 text-[15px] text-muted">{page.titleHi} · जितनी जल्दी, पैसा रुकने का उतना ज़्यादा मौका</p>
      <TurantSteps page={page} slot={asksWhen(slug) ? <KabChips /> : null} />
      <p className="mt-6">
        <Link href="/case" className="inline-flex min-h-12 items-center font-semibold text-brand">
          शिकायत नंबर और तारीख़ें सँभालें: मेरा केस →
        </Link>
      </p>
      <p>
        <Link href="/turant" className="inline-flex min-h-12 items-center font-semibold text-brand">
          दूसरा प्रकार चुनें
        </Link>
      </p>
      {gyanForTurant(slug).map((g) => (
        <p key={g.slug}>
          <Link href={`/gyan/${g.slug}`} className="inline-flex min-h-12 items-center font-semibold text-brand">
            यह ठगी कैसे होती है, विस्तार से: {g.navTitleHi} →
          </Link>
        </p>
      ))}
    </>
  );
}
