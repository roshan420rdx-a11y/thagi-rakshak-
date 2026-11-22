import type { Metadata } from "next";
import { pageMeta } from "@/modules/site/meta";
import { FailedTxnView } from "@/components/haq/failed-txn-view";
import { todayInKolkata } from "@/modules/rules-engine";

export const metadata: Metadata = pageMeta({
  title: "fail लेन-देन: ₹100 रोज़",
  description:
    "UPI, ATM या card का लेन-देन fail हुआ पर पैसा कटा? RBI के नियम से तय दिनों में न लौटे, तो बैंक को देरी का हर्जाना देना होता है। हिसाब देखें।",
  path: "/haq/failed-txn",
});

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function FailedTxnPage({ searchParams }: Props) {
  return <FailedTxnView params={await searchParams} today={todayInKolkata()} />;
}
