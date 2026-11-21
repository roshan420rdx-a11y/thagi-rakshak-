import type { TurantAction } from "@/modules/scams";
import { IconExternal, IconPhone } from "./icons";

// call करने या बाहर जाने का बटन-जैसा link (कम से कम 48px ऊँचा)
export function ActionLink({ action, primary = false }: { action: TurantAction; primary?: boolean }) {
  const look = primary
    ? "bg-danger text-on-danger border-danger"
    : "bg-paper text-ink border-line";
  const cls = `inline-flex min-h-12 items-center gap-2 rounded-[10px] border px-4 py-2 font-semibold no-underline ${look}`;

  if (action.kind === "tel") {
    return (
      <a href={`tel:${action.number}`} className={cls}>
        <IconPhone className="h-5 w-5" />
        {action.labelHi}
      </a>
    );
  }
  return (
    <a
      href={action.href}
      className={cls}
      {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {action.labelHi}
      {action.external ? <IconExternal className="h-4 w-4" /> : null}
    </a>
  );
}
