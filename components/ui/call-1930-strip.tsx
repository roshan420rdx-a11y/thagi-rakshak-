import { IconPhone } from "./icons";

// पैसे अभी गए हों तो पहला काम हर हाल में 1930: होम और 404 से एक tap (plan A2d)
export function Call1930Strip() {
  return (
    <a
      href="tel:1930"
      className="flex min-h-12 items-center gap-3 rounded-xl border-2 border-danger bg-danger-bg px-4 py-2 text-danger no-underline"
    >
      <IconPhone className="h-6 w-6 shrink-0" />
      <span>
        <span className="block text-[19px] font-bold leading-snug">1930 मिलाएँ</span>
        <span className="block text-[15px] font-semibold leading-snug">पैसे अभी गए हैं? सबसे पहले यह call करें</span>
      </span>
    </a>
  );
}
