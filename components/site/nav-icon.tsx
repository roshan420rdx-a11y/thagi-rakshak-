import { IconSearch, IconShield } from "@/components/ui/icons";
import type { NavIcon } from "@/modules/site";

const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function NavIconSvg({ icon }: { icon: NavIcon }) {
  if (icon === "search") return <IconSearch className="h-[22px] w-[22px]" />;
  if (icon === "shield") return <IconShield className="h-[22px] w-[22px]" />;
  if (icon === "case")
    return (
      <svg {...base}>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    );
  return (
    <svg {...base}>
      <path d="M3 11l9-8 9 8v10H3z" />
    </svg>
  );
}
