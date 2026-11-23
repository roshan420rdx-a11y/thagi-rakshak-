import Link from "next/link";
import { IconShield } from "@/components/ui/icons";
import { TextSizeButton } from "@/components/ui/text-size-button";
import { HeaderNav } from "./header-nav";

// ऊपर: पहचान (logo, नाम, एक लाइन में क्या करते हैं) और दाईं ओर अ+ व इमरजेंसी बटन; desktop पर उसके नीचे menu की पट्टी
export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-[1040px] flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-2 md:py-3">
        <Link href="/" className="inline-flex min-h-12 items-center gap-2.5 whitespace-nowrap no-underline">
          <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-brand text-paper md:h-10 md:w-10">
            <IconShield className="h-5 w-5 md:h-6 md:w-6" />
          </span>
          <span className="leading-tight">
            <span className="block text-[19px] font-bold text-brand md:text-[21px]">ठगी रक्षक</span>
            <span className="hidden text-[13px] text-muted sm:block">डिजिटल ठगी में मुफ़्त मदद</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <TextSizeButton />
          <Link
            href="/turant"
            className="inline-flex min-h-12 items-center whitespace-nowrap rounded-[10px] bg-danger px-3 font-bold text-on-danger no-underline transition hover:brightness-110 md:px-4"
          >
            ठगी हो गई
          </Link>
        </div>
      </div>
      <HeaderNav />
    </header>
  );
}
