import type { ReactNode } from "react";
import { OfflineBanner } from "@/components/offline/offline-banner";
import { IconShield } from "@/components/ui/icons";
import { ListenButton } from "@/components/ui/listen-button";
import { TextSizeButton } from "@/components/ui/text-size-button";
import Link from "next/link";

// इमरजेंसी पन्नों का ढाँचा: सिर्फ़ होम पर वापसी (साइट के नाम के साथ), अ+ और "सुनें"; कोई menu नहीं, ताकि ध्यान न भटके
export default function TurantLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-[680px] flex-wrap items-center justify-between gap-2 px-4 py-2">
          <Link href="/" aria-label="ठगी रक्षक: होम पर वापस" className="inline-flex min-h-12 items-center gap-2 whitespace-nowrap font-bold text-brand no-underline">
            <span aria-hidden="true">←</span>
            <IconShield className="h-5 w-5" />
            ठगी रक्षक
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <TextSizeButton />
            <ListenButton targetId={["turant-banner", "turant-steps"]} />
          </div>
        </div>
      </header>
      <OfflineBanner />
      <main id="main" className="mx-auto max-w-[680px] px-4 py-4">
        {children}
      </main>
    </>
  );
}
