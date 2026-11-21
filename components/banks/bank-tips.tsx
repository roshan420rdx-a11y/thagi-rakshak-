import { BANK_TIPS } from "@/modules/banks";

// बैंक से जुड़े सुरक्षा-सुझाव, हर एक के साथ (जहाँ हो) RBI का हवाला
export function BankTips() {
  return (
    <ol className="space-y-2">
      {BANK_TIPS.map((tip, i) => (
        <li key={tip.id} data-tip={tip.id} className="rounded-xl border border-line bg-paper p-3">
          <p>
            <span className="font-bold">{i + 1}. </span>
            {tip.textHi}
          </p>
          {tip.source ? <p className="mt-1 text-[13px] text-muted">RBI: {tip.source.paragraph}</p> : null}
        </li>
      ))}
    </ol>
  );
}
