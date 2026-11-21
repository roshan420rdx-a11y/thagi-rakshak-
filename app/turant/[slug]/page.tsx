import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TurantSteps } from "@/components/turant/turant-steps";
import { TURANT_SLUGS, getTurantPage, isTurantSlug } from "@/modules/scams";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return TURANT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isTurantSlug(slug)) return {};
  return { title: `${getTurantPage(slug).titleHi} — ठगी रक्षक` };
}

export default async function TurantPageRoute({ params }: Props) {
  const { slug } = await params;
  if (!isTurantSlug(slug)) notFound();
  const page = getTurantPage(slug);
  return (
    <>
      <h1 className="text-[22px] font-bold leading-snug">ये काम अभी करें</h1>
      <p className="mb-3 text-[15px] text-muted">{page.titleHi} · जितनी जल्दी, पैसा रुकने का उतना ज़्यादा मौका</p>
      <TurantSteps page={page} />
      <p className="mt-6">
        <Link
 href="/turant" className="inline-flex min-h-12 items-center font-semibold text-brand">
          दूसरा प्रकार चुनें
        </Link>
      </p>
    </>
  );
}
