// Share से सीधे जाँच (plan A2f): WhatsApp/SMS में message पर "Share → ठगी रक्षक"। message service worker फ़ोन के अंदर ही
// लेता है (POST /pucho/share network पर नहीं जाता), इस अलग डिब्बे में रखता है, और "पहले पूछो" उसे पढ़ते ही मिटा देता है।
import { MAX_CHECK_CHARS } from "./check";

export const SHARE_PATH = "/pucho/share";
export const SHARE_CACHE = "thagi-rakshak-share-v1";
export const SHARE_KEY = "/__share-inbox";
// WhatsApp की photo/screenshot पर Share (TR-36b): photo भी उसी डिब्बे में, अपनी key पर; पन्ना उसे फ़ोन में ही पढ़कर मिटाता है
export const SHARE_IMAGE_KEY = "/__share-image";
export const MAX_SHARE_IMAGE_BYTES = 15 * 1024 * 1024;

export const SHARE_MISSED_HI =
  'share किया message या photo यहाँ नहीं पहुँचा। message पर उँगली दबाकर copy करें, फिर ऊपर "चिपकाएँ" दबाएँ (या डिब्बे में Paste करें); photo हो, तो "photo या screenshot से जाँचें" दबाकर चुनें।';

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

// Share में आई files में से पहली असली photo (ख़ाली, ग़ैर-photo, हद से बड़ी नहीं)। service worker में यही तर्क एक string में है;
// test दोनों को मिलाता है।
export function pickSharedImage(entries: readonly unknown[], max: number): Blob | null {
  for (const f of entries) {
    if (f instanceof Blob && f.type.startsWith("image/") && f.size > 0 && f.size <= max) return f;
  }
  return null;
}

// डिब्बे से photo लेना और उसी समय मिटाना
export async function takeSharedImage(c: CachesLike | undefined): Promise<Blob | null> {
  if (!c) return null;
  try {
    const box = await c.open(SHARE_CACHE);
    const hit = await box.match(SHARE_IMAGE_KEY);
    if (!hit) return null;
    const blob = await hit.blob();
    await box.delete(SHARE_IMAGE_KEY);
    return pickSharedImage([blob], MAX_SHARE_IMAGE_BYTES);
  } catch {
    return null;
  }
}
