import type { Metadata } from "next";
import { pageMeta } from "@/modules/site/meta";
import { ThagiView } from "@/components/haq/thagi-view";
import { todayInKolkata } from "@/modules/rules-engine";

export const metadata: Metadata = pageMeta({
  title: "ठगी में पैसा गया: आपका हक़",
  description:
    "ठगी में पैसा गया? RBI के नियमों से देखें: आपकी ज़िम्मेदारी कितनी, मुआवज़ा मिल सकता है या नहीं, और बैंक को कब तक बताना है।",
  path: "/haq/thagi",
});

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ThagiHaqPage({ searchParams }: Props) {
  return <ThagiView params={await searchParams} today={todayInKolkata()} />;
}
