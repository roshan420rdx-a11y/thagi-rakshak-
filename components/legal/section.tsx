import type { ReactNode } from "react";

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-[19px] font-bold">{title}</h2>
      {children}
    </section>
  );
}
