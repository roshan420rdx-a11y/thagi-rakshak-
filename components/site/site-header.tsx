import Link from "next/link";
import { IconShield } from "@/components/ui/icons";
import { TextSizeButton } from "@/components/ui/text-size-button";
import { liveNavItems } from "@/modules/site";

// ऊपर की पट्टी: logo (होम का link); desktop पर menu के links और हमेशा दिखने वाला "ठगी हो गई" बटन
export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-[960px] flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-2">
        <Link href="/" className="inline-flex min-h-12 items-center gap-2 text-[19px] font-bold text-brand no-underline">
          <IconShield className="h-6 w-6" />
          ठगी रक्षक
        </Link>
        <nav aria-label="ऊपर का menu" className="hidden items-center gap-4 md:flex">
          {liveNavItems().map((item) => (
            <Link key={item.href} href={item.href} className="inline-flex min-h-12 items-center font-semibold text-ink no-underline">
              {item.labelHi}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <TextSizeButton />
          <Link
            href="/turant"
            className="inline-flex min-h-12 items-center rounded-[10px] bg-danger px-3 font-bold text-on-danger no-underline"
          >
            ठगी हो गई
          </Link>
        </div>
      </div>
    </header>
  );
}
