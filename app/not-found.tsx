import { BigDoor } from "@/components/ui/big-door";
import { Call1930Strip } from "@/components/ui/call-1930-strip";
import { IconAlert } from "@/components/ui/icons";
import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-[680px] space-y-4 px-4 py-8">
        <h1 className="text-[22px] font-bold md:text-[28px]">यह पन्ना नहीं मिला।</h1>
        <p>ठगी हो गई है? इमरजेंसी मदद यहाँ है:</p>
        <BigDoor
          href="/turant"
          title="मेरे साथ ठगी हो गई"
          subtitle="अभी मदद पाएँ · मुफ़्त · बिना login"
          tone="danger"
          icon={<IconAlert className="h-8 w-8" />}
        />
        <Call1930Strip />
        <p>
          <Link href="/" className="inline-flex min-h-12 items-center font-semibold text-brand">
            होम पर जाएँ
          </Link>
        </p>
      </main>
    </>
  );
}
