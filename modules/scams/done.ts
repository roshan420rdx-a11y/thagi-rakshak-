// /turant के कदमों पर "हो गया ✓" (plan A2f): घबराहट में पता रहे कि क्या हो गया, क्या बाकी। सिर्फ़ इसी फ़ोन में
// (localStorage), offline भी; कोई निजी जानकारी नहीं, सिर्फ़ कदमों के नाम।
export const DONE_KEY = "thagi-rakshak:turant-done:v1";

export type DoneState = Record<string, string[]>;

export function parseDone(raw: string | null): DoneState {
  if (!raw) return {};
  try {
    const v: unknown = JSON.parse(raw);
    if (!v || typeof v !== "object" || Array.isArray(v)) return {};
    const out: DoneState = {};
    for (const [slug, ids] of Object.entries(v as Record<string, unknown>)) {
      if (!Array.isArray(ids)) continue;
      const clean = ids.filter((x): x is string => typeof x === "string" && x.length > 0);
      if (clean.length) out[slug] = clean;
    }
    return out;
  } catch {
    return {};
  }
}

export function isDone(s: DoneState, slug: string, stepId: string): boolean {
  return s[slug]?.includes(stepId) ?? false;
}

export function toggleDone(s: DoneState, slug: string, stepId: string): DoneState {
  const cur = s[slug] ?? [];
  const next = cur.includes(stepId) ? cur.filter((x) => x !== stepId) : [...cur, stepId];
  const out: DoneState = { ...s };
  if (next.length) out[slug] = next;
  else delete out[slug];
  return out;
}

// सिर्फ़ इस पन्ने के आज वाले कदम (content बदलने पर हटे कदम नहीं गिने जाते)
export function doneCount(s: DoneState, slug: string, stepIds: readonly string[]): number {
  return stepIds.filter((id) => isDone(s, slug, id)).length;
}
