import { ActionLink } from "@/components/ui/action-link";
import type { BankChannel } from "@/modules/banks";
import { formatHindiDate } from "@/modules/rules-engine";

// 1800 वाले नंबर पढ़ने में आसान: 18002586161 → 1800 258 6161 · 1800222244 → 1800 222 244 · 18005700 → 1800 5700
export function formatPhone(n: string): string {
  if (!n.startsWith("1800") || n.length < 8) return n;
  const rest = n.slice(4);
  if (rest.length === 7) return `1800 ${rest.slice(0, 3)} ${rest.slice(3)}`;
  if (rest.length === 6) return `1800 ${rest.slice(0, 3)} ${rest.slice(3)}`;
  return `1800 ${rest}`;
}

// दो-जाँच वाला एक रास्ता (सिर्फ़ live channels के लिए इस्तेमाल होता है)
export function BankChannelView({ channel: c }: { channel: BankChannel }) {
  return (
    <div className="space-y-1">
      {c.kind === "tel" ? (
        <>
          <ActionLink action={{ kind: "tel", number: c.value, labelHi: formatPhone(c.value) }} primary />
          <p className="text-[15px]">{c.labelHi}</p>
        </>
      ) : c.kind === "web" ? (
        <a href={c.value} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 font-semibold text-brand">
          {new URL(c.value).hostname} → {c.labelHi}
        </a>
      ) : (
        <p className="font-semibold">
          {c.labelHi}: {c.value}
        </p>
      )}
      <p className="text-[13px] text-muted">
        स्रोत: बैंक की अपनी वेबसाइट · दो बार जाँचा{c.verifiedOn ? `: ${formatHindiDate(c.verifiedOn)}` : ""}
      </p>
    </div>
  );
}
