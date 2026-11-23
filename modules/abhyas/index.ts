// "ठगी या असली?" अभ्यास (plan A3f): round चुनना और जवाब जाँचना। शुद्ध functions; सब फ़ोन में, कुछ सेव नहीं।
import { ABHYAS_ITEMS } from "@/content/abhyas/hi";
import { checkMessage } from "@/modules/checker";
import type { GyanSlug } from "@/modules/gyan";
import type { AbhyasItem } from "./types";

export { ABHYAS_ITEMS };
export type { AbhyasItem };

export const ROUND_SIZE = 8;
export const ROUND_REAL = 3; // हर round में कम से कम इतने असली: सिर्फ़ "सब ठगी है" कहने से पूरे नंबर न मिलें

function shuffle<T>(arr: readonly T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickRound(items: readonly AbhyasItem[], rand: () => number = Math.random): AbhyasItem[] {
  const scams = shuffle(
    items.filter((i) => i.scam),
    rand,
  ).slice(0, ROUND_SIZE - ROUND_REAL);
  const reals = shuffle(
    items.filter((i) => !i.scam),
    rand,
  ).slice(0, ROUND_REAL);
  return shuffle([...scams, ...reals], rand);
}

export type Verdict = { correct: boolean; titleHi: string; signsHi: string[]; whyHi: string; gyan?: GyanSlug };

// निशान वही जो "पहले पूछो" दिखाता है (एक ही नियम से सीख)। असली को "ठगी" कहना ग़लत है, पर शक करने की आदत की शाबाशी।
export function judge(item: AbhyasItem, saidScam: boolean): Verdict {
  const correct = saidScam === item.scam;
  const titleHi = item.scam
    ? correct
      ? "सही! यह ठगी है।"
      : "यह ठगी है।"
    : correct
      ? "सही! इसमें ठगी का कोई निशान नहीं।"
      : "शक करना अच्छी आदत है! पर इसमें ठगी का कोई निशान नहीं।";
  const signsHi = item.scam ? checkMessage(item.text).hits.map((h) => h.labelHi) : [];
  return { correct, titleHi, signsHi, whyHi: item.whyHi, gyan: item.gyan };
}

export function scoreMessage(right: number, total: number): string {
  if (right >= total) return "बहुत बढ़िया! आपने सब पहचान लिए। यही ध्यान आगे भी रखें, और घर के लोगों को भी सिखाएँ।";
  if (right >= total - 2) return "अच्छा! ज़्यादातर पहचान लिए। जो छूटे, उनके निशान नीचे देख लें।";
  return "कोई बात नहीं: ठग message बहुत असली जैसे बनाते हैं। नीचे देखें क्या छूटा, और एक बार और अभ्यास करें; हर बार नए message आते हैं।";
}
