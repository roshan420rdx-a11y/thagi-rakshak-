import type { ReactNode } from "react";
import { OfflineBanner } from "@/components/offline/offline-banner";
import { ListenButton } from "@/components/ui/listen-button";
import Link from "next/link";

// इमरजेंसी पन्नों का ढाँचा: सिर्फ़ "← वापस" और "सुनें"; कोई नीचे वाला menu नहीं, ताकि ध्यान न भटके
export default function TurantLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="flex items-center justify-between border-b border-line bg-paper px-4 py-2">
        <Link
 href="/" className="inline-flex min-h-12 items-center font-bold text-danger no-underline">
          ← वापस
        </Link>
        <ListenButton targetId="turant-steps" />
      </header>
      <OfflineBanner />
      <main className="mx-auto max-w-[680px] px-4 py-4">{children}</main>
    </>
  );
}
