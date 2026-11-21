import type { ReactNode } from "react";

// क्रम वाला एक कदम: नंबर, शीर्षक, जल्दी की बात (urgency), और बाकी सामग्री
export function StepCard({
  n,
  title,
  urgency,
  status = "todo",
  children,
}: {
  n: number;
  title: string;
  urgency?: string;
  status?: "todo" | "done";
  children: ReactNode;
}) {
  return (
    <li data-status={status} className="flex gap-3 rounded-xl border border-line bg-paper p-3">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-danger font-bold text-on-danger"
      >
        {n}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-[17px] font-bold leading-snug">
          <span className="sr-only">कदम {n}: </span>
          {title}
        </h2>
        {urgency ? (
          <p className="mt-1 inline-block rounded-md bg-danger-bg px-2 text-[14px] font-semibold text-danger">{urgency}</p>
        ) : null}
        <div className="mt-1 space-y-2 text-[16px]">{children}</div>
      </div>
    </li>
  );
}
