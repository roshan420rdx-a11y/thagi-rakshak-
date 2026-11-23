"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DONE_KEY, doneCount, isDone, parseDone, toggleDone, type DoneState } from "@/modules/scams/done";

// "हो गया ✓" (plan A2f): कदमों की याद इसी फ़ोन में। mount से पहले (और बिना JS के) कुछ नहीं दिखता, कदम पहले जैसे।
// "सुनें" इन्हें नहीं पढ़ता (data-no-listen)।
type Ctx = { state: DoneState; slug: string; ids: readonly string[]; toggle: (id: string) => void; reset: () => void };
const DoneCtx = createContext<Ctx | null>(null);

function save(s: DoneState) {
  try {
    if (Object.keys(s).length) window.localStorage.setItem(DONE_KEY, JSON.stringify(s));
    else window.localStorage.removeItem(DONE_KEY);
  } catch {
    // storage बंद हो तो सिर्फ़ इस बार के लिए
  }
}

export function StepsDoneProvider({ slug, stepIds, children }: { slug: string; stepIds: readonly string[]; children: ReactNode }) {
  const [state, setState] = useState<DoneState | null>(null);

  useEffect(() => {
    let s: DoneState = {};
    try {
      s = parseDone(window.localStorage.getItem(DONE_KEY));
    } catch {
      // storage बंद
    }
    setState(s);
  }, []);

  const value: Ctx | null = state
    ? {
        state,
        slug,
        ids: stepIds,
        toggle: (id) =>
          setState((prev) => {
            const next = toggleDone(prev ?? {}, slug, id);
            save(next);
            return next;
          }),
        reset: () =>
          setState((prev) => {
            const next = { ...(prev ?? {}) };
            delete next[slug];
            save(next);
            return next;
          }),
      }
    : null;

  return <DoneCtx.Provider value={value}>{children}</DoneCtx.Provider>;
}

export function StepsProgress() {
  const c = useContext(DoneCtx);
  if (!c) return null;
  const n = doneCount(c.state, c.slug, c.ids);
  const total = c.ids.length;
  return (
    <div data-no-listen className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl bg-safe-bg px-3 py-2 text-safe">
      <p aria-live="polite" className="font-bold">
        {n === total ? `सारे ${total} कदम हो गए` : `${total} में से ${n} कदम हो गए`}
      </p>
      {n > 0 ? (
        <button type="button" onClick={c.reset} className="inline-flex min-h-11 items-center font-semibold underline">
          सब फिर से
        </button>
      ) : (
        <span className="text-[15px]">हर कदम के बाद &quot;हो गया&quot; दबाएँ</span>
      )}
    </div>
  );
}

export function StepDoneButton({ stepId, n }: { stepId: string; n: number }) {
  const c = useContext(DoneCtx);
  if (!c) return null;
  const done = isDone(c.state, c.slug, stepId);
  return (
    <button
      type="button"
      data-no-listen
      data-step-done
      aria-pressed={done}
      aria-label={`कदम ${n} हो गया`}
      onClick={() => c.toggle(stepId)}
      className={`inline-flex min-h-11 items-center gap-1 rounded-[10px] border px-3 font-semibold ${
        done ? "border-safe bg-safe text-on-safe" : "border-line bg-paper text-safe"
      }`}
    >
      {done ? <span aria-hidden="true">✓</span> : null}
      हो गया
    </button>
  );
}
