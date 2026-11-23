import type { Metadata } from "next";
import { pageMeta } from "@/modules/site/meta";
import Link from "next/link";

export const metadata: Metadata = pageMeta({
  title: "आपका हक़",
  description:
    "डिजिटल ठगी या fail लेन-देन में आपका हक़: RBI के नियमों से हिसाब कि पैसा वापस मिल सकता है या नहीं, और कितने दिन में। मुफ़्त।",
  path: "/haq",
});

const CARDS = [
  { href: "/haq/thagi", title: "ठगी में पैसा गया", body: "पूरा पैसा वापस, या ₹25,000 तक मुआवज़ा? RBI के नियमों से हिसाब" },
  { href: "/haq/failed-txn", title: "लेन-देन fail हुआ, पैसा अटका", body: "देर पर ₹100 रोज़ का हिसाब (यह ठगी नहीं है)" },
  { href: "/haq/frozen-money", title: "ठग के खाते में पैसा रुका (freeze)", body: "वापस कैसे माँगें" },
  { href: "/shikayat-rasta", title: "शिकायत का पूरा रास्ता", body: "1930, cybercrime.gov.in, बैंक, पुलिस और RBI Ombudsman: क्रम से" },
] as const;

export default function HaqIndexPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold md:text-[28px] leading-snug">आपका हक़</h1>
      <p>RBI और सरकार के नियमों से जानिए कि आपका कितना हक़ बनता है। मुफ़्त, बिना login।</p>
      <ul className="space-y-3">
        {CARDS.map((c) => (
          <li key={c.href}>
            <Link href={c.href} className="block min-h-12 rounded-xl border border-line bg-paper p-3 text-ink no-underline">
              <span className="block text-[17px] font-bold text-brand">{c.title} →</span>
              <span className="block text-[15px]">{c.body}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
