import { formatHindiDate } from "@/modules/rules-engine";
import type { RightResult, Status } from "@/modules/rules-engine";
import { SourceLine } from "./source-line";

const STATUS: Record<Status, { labelHi: string; cls: string }> = {
  confirmed: { labelHi: "पक्का", cls: "bg-safe text-on-safe" },
  likely: { labelHi: "संभावित", cls: "bg-safe text-on-safe" },
  unclear: { labelHi: "साफ़ नहीं", cls: "bg-warn-bg text-warn border border-warn" },
  not_eligible: { labelHi: "हक़ नहीं बनता", cls: "bg-surface text-muted border border-line" },
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function RightsResultCard({ result }: { result: RightResult }) {
  const st = STATUS[result.status];
  return (
    <article className="space-y-2 rounded-xl border border-line bg-paper p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-[17px] font-bold leading-snug">{result.titleHi}</h3>
        <span className={`rounded-full px-3 py-0.5 text-[14px] font-bold ${st.cls}`}>{st.labelHi}</span>
      </div>
      {result.amount !== undefined ? (
        <p className="rounded-lg bg-safe-bg p-2 text-center text-safe">
          <span className="block text-[14px]">{result.amountLabelHi ?? "रकम"}</span>
          <span className="block text-[26px] font-bold">{inr(result.amount)}</span>
        </p>
      ) : null}
      <ul className="list-disc space-y-1 pl-5 text-[16px]">
        {result.reasonsHi.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      {result.deadlines.length > 0 ? (
        <ul className="space-y-1">
          {result.deadlines.map((d) => (
            <li key={d.labelHi} className="rounded-lg bg-warn-bg px-2 py-1 text-[15px] font-semibold text-warn">
              {d.labelHi}: {formatHindiDate(d.date)}
              {d.status === "likely" ? " (अनुमान)" : ""}
            </li>
          ))}
        </ul>
      ) : null}
      <SourceLine source={result.source} verifiedBy={result.verifiedBy} />
    </article>
  );
}
