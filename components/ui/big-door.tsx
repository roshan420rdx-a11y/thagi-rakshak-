import type { ReactNode } from "react";

// होम और 404 के बड़े दरवाज़े: पूरा card ही link है, कम से कम 88px ऊँचा। लाल सिर्फ़ इमरजेंसी वाले के लिए।
export function BigDoor({
  href,
  title,
  subtitle,
  tone,
  icon,
}: {
  href: string;
  title: string;
  subtitle: string;
  tone: "danger" | "brand";
  icon?: ReactNode;
}) {
  const colors = tone === "danger" ? "bg-danger text-on-danger" : "bg-brand text-paper";
  return (
    <a
      href={href}
      className={`flex h-full min-h-[88px] items-center gap-3 rounded-[14px] px-4 py-4 no-underline shadow-sm transition hover:brightness-110 ${colors}`}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span>
        <span className="block text-[19px] font-bold leading-snug">{title}</span>
        <span className="block text-[15px] opacity-95">{subtitle}</span>
      </span>
      <span aria-hidden="true" className="ml-auto shrink-0 pl-1 text-[22px] font-bold">
        →
      </span>
    </a>
  );
}
