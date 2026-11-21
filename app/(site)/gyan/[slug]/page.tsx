import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GyanArticle } from "@/components/gyan/gyan-article";
import { GYAN_PAGES, getGyanPage } from "@/modules/gyan";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return GYAN_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getGyanPage((await params).slug);
  return p ? { title: `${p.navTitleHi} — ठगी रक्षक`, description: p.descriptionHi } : {};
}

export default async function GyanPageRoute({ params }: Props) {
  const p = getGyanPage((await params).slug);
  if (!p) notFound();
  return <GyanArticle page={p} />;
}
