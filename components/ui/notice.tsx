import type { ReactNode } from "react";
import { IconAlert, IconInfo } from "./icons";

// चेतावनी/सूचना का box। मतलब सिर्फ़ रंग से नहीं: हर box में icon और एक शब्द ("ज़रूरी:", "ध्यान दें:", "जानकारी:")
const LOOK = {
  danger: { cls: "border-danger bg-danger-bg text-danger", label: "ज़रूरी:" },
  warn: { cls: "border-warn bg-warn-bg text-warn", label: "ध्यान दें:" },
  info: { cls: "border-line bg-brand-bg text-brand", label: "जानकारी:" },
} as const;

export function Notice({ tone, children }: { tone: "danger" | "warn" | "info"; children: ReactNode }) {
  const look = LOOK[tone];
  const Icon = tone === "info" ? IconInfo : IconAlert;
  return (
    <div role="note" className={`flex gap-2 rounded-[10px] border-2 p-3 text-[16px] font-semibold ${look.cls}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <p>
        <span>{look.label} </span>
        {children}
      </p>
    </div>
  );
}
