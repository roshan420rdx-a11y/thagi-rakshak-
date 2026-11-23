import Link from "next/link";

// बैंक को लिखित शिकायत का तैयार पत्र (/arzi): बैंक वाले पन्नों से सीधे
export function BankArziLink() {
  return (
    <Link
      href="/arzi"
      className="flex min-h-12 items-center rounded-xl border border-line bg-paper px-4 py-2 font-semibold text-brand no-underline"
    >
      बैंक शाखा को देने का शिकायत पत्र बनाएँ (मुफ़्त) →
    </Link>
  );
}
