import type { Metadata } from "next";
import { ThagiView } from "@/components/haq/thagi-view";
import { todayInKolkata } from "@/modules/rules-engine";

export const metadata: Metadata = { title: "ठगी में पैसा गया: आपका हक़ — ठगी रक्षक" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ThagiHaqPage({ searchParams }: Props) {
  return <ThagiView params={await searchParams} today={todayInKolkata()} />;
}
