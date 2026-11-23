// Share से सीधे जाँच (plan A2f): WhatsApp/SMS में message पर "Share → ठगी रक्षक"। message service worker फ़ोन के अंदर ही
// लेता है (POST /pucho/share network पर नहीं जाता), इस अलग डिब्बे में रखता है, और "पहले पूछो" उसे पढ़ते ही मिटा देता है।
import { MAX_CHECK_CHARS } from "./check";

export const SHARE_PATH = "/pucho/share";
export const SHARE_CACHE = "thagi-rakshak-share-v1";
export const SHARE_KEY = "/__share-inbox";

export const SHARE_MISSED_HI =
  'share किया message यहाँ नहीं पहुँचा। message पर उँगली दबाकर copy करें, फिर ऊपर "चिपकाएँ" दबाएँ (या डिब्बे में Paste करें)।';

// title, text, url जोड़कर एक message (service worker में यही तर्क एक string में है; test दोनों को मिलाता है)
export function combineShared(title: unknown, text: unknown, url: unknown): string {
  const t = typeof text === "string" ? text.trim() : "";
  const u = typeof url === "string" ? url.trim() : "";
  const parts = [typeof title === "string" ? title.trim() : "", t];
  if (u && !t.includes(u)) parts.push(u);
  return parts.filter(Boolean).join("\n").slice(0, MAX_CHECK_CHARS);
}

type CacheBox = { match: (key: string) => Promise<Response | undefined>; delete: (key: string) => Promise<boolean> };
type CachesLike = { open: (name: string) => Promise<CacheBox> };

// डिब्बे से message लेना और उसी समय मिटाना (दोबारा खोलने पर पुराना message न दिखे)
export async function takeSharedText(c: CachesLike | undefined): Promise<string | null> {
  if (!c) return null;
  try {
    const box = await c.open(SHARE_CACHE);
    const hit = await box.match(SHARE_KEY);
    if (!hit) return null;
    const text = (await hit.text()).trim().slice(0, MAX_CHECK_CHARS);
    await box.delete(SHARE_KEY);
    return text || null;
  } catch {
    return null;
  }
}
