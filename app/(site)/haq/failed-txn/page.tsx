import type { Metadata } from "next";
import { FailedTxnView } from "@/components/haq/failed-txn-view";
import { todayInKolkata } from "@/modules/rules-engine";

export const metadata: Metadata = { title: "fail लेन-देन: ₹100 रोज़ — ठगी रक्षक" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function FailedTxnPage({ searchParams }: Props) {
  return <FailedTxnView params={await searchParams} today={todayInKolkata()} />;
}
