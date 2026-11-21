import { IconShield } from "./icons";

export const PLEDGE_LINE = "हम कभी OTP, PIN, password नहीं माँगते, न screen-share करवाते हैं, न पहले call करते हैं।";

// प्रतिज्ञा की एक लाइन: होम और हर पन्ने के footer में
export function TrustBar() {
  return (
    <p className="flex gap-2 rounded-xl bg-brand-bg p-3 text-[15px] font-semibold text-brand">
      <IconShield className="mt-0.5 h-5 w-5 shrink-0" />
      <span>{PLEDGE_LINE}</span>
    </p>
  );
}
