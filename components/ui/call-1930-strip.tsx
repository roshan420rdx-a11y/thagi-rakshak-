import { IconPhone } from "./icons";

// पैसे अभी गए हों तो पहला काम हर हाल में 1930: होम और 404 से एक tap (plan A2d)। शांत रूप, बाईं लाल रेखा से पहचान।
export function Call1930Strip() {
  return (
    <a
      href="tel:1930"
      className="flex h-full min-h-12 items-center gap-3 rounded-xl border border-l-4 border-line border-l-danger bg-paper px-4 py-3 text-ink no-underline transition-colors hover:border-danger"
    >
      <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-danger-bg text-danger">
        <IconPhone className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-[19px] font-bold leading-snug">1930 मिलाएँ</span>
        <span className="block text-[15px] leading-snug text-muted">पैसे अभी गए हैं? सबसे पहले यह call करें</span>
      </span>
    </a>
  );
}
