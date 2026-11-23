import Link from "next/link";
import { isCurrentPath, liveNavItems } from "@/modules/site";
import { NavIconSvg } from "./nav-icon";

// फ़ोन का नीचे वाला menu (सिर्फ़ live tabs)। शुद्ध render, ताकि test हो सके; चालू पन्ना बाहर से आता है।
export function BottomNavView({ current }: { current: string }) {
  return (
    <nav
      aria-label="मुख्य menu"
      className="fixed inset-x-0 bottom-0 z-10 flex border-t border-line bg-paper md:hidden"
    >
      {liveNavItems().map((item) => {
        const on = isCurrentPath(item.href, current);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={on ? "page" : undefined}
            className={`flex min-h-14 flex-1 flex-col items-center justify-center text-[13px] no-underline ${
              on ? "font-bold text-brand" : "text-muted"
            }`}
          >
            <NavIconSvg icon={item.icon} />
            {item.labelHi}
          </Link>
        );
      })}
    </nav>
  );
}
