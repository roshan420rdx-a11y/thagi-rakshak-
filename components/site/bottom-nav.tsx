"use client";

import { usePathname } from "next/navigation";
import { BottomNavView } from "./bottom-nav-view";

export function BottomNav() {
  return <BottomNavView current={usePathname() ?? "/"} />;
}
