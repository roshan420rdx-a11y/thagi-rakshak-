import type { ReactNode } from "react";

export const INPUT_CLS = "min-h-12 w-full rounded-[10px] border border-line bg-paper px-3 text-[18px] text-ink";

// एक सवाल: label, (वैकल्पिक) छोटा संकेत, और input
export function Field({ label, hint, htmlFor, children }: { label: string; hint?: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block font-semibold">
        {label}
      </label>
      {hint ? <p className="text-[14px] text-muted">{hint}</p> : null}
      {children}
    </div>
  );
}

// radio के विकल्प (हर एक कम से कम 48px ऊँचा)
export function Radios({ name, options, value }: { name: string; options: readonly (readonly [string, string])[]; value: string }) {
  return (
    <fieldset className="space-y-1">
      {options.map(([v, label]) => (
        <label key={v} className="flex min-h-12 items-center gap-3 rounded-[10px] border border-line bg-paper px-3">
          <input type="radio" name={name} value={v} defaultChecked={v === value} className="h-5 w-5" />
          <span>{label}</span>
        </label>
      ))}
    </fieldset>
  );
}
