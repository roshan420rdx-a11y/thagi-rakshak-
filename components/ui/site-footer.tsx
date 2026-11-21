import Link from "next/link";
import { TrustBar } from "./trust-bar";

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-10 max-w-[680px] space-y-2 px-4 pb-24 text-[14px] text-muted md:pb-8">
      <TrustBar />
      <p>यह सरकारी वेबसाइट नहीं है। हम आपको सरकारी और बैंक के सही रास्तों तक पहुँचाने में मदद करते हैं।</p>
      <p>यहाँ दी गई जानकारी कानूनी सलाह नहीं है।</p>
      <nav aria-label="नियम और नीतियाँ" className="flex flex-wrap gap-x-4">
        <Link href="/legal/privacy" className="inline-flex min-h-12 items-center text-brand">
          निजता (privacy)
        </Link>
        <Link href="/legal/terms" className="inline-flex min-h-12 items-center text-brand">
          शर्तें
        </Link>
        <Link href="/legal/shikayat" className="inline-flex min-h-12 items-center text-brand">
          शिकायत अधिकारी
        </Link>
      </nav>
    </footer>
  );
}
