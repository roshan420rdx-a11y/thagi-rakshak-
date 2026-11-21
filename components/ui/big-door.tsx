import type { ReactNode } from "react";

// होम और 404 के बड़े दरवाज़े: पूरा card ही link है, कम से कम 88px ऊँचा
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
  tone: "danger" | "safe";
  icon?: ReactNode;
}) {
  const colors = tone === "danger" ? "bg-danger text-on-danger" : "bg-safe text-on-safe";
  return (
    <a href={href} className={`flex min-h-[88px] items-center gap-3 rounded-[14px] px-4 py-4 no-underline ${colors}`}>
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span>
        <span className="block text-[19px] font-bold leading-snug">{title}</span>
        <span className="block text-[15px] opacity-95">{subtitle}</span>
      </span>
    </a>
  );
}
