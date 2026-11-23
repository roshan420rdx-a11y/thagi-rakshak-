// "चिपकाएँ" बटन (plan A2e): clipboard सिर्फ़ बटन दबाने पर पढ़ा जाता है। text कहीं भेजा नहीं जाता, सिर्फ़ जाँच के डिब्बे में।
import { MAX_CHECK_CHARS } from "./check";

export type PasteFailure = "unsupported" | "denied" | "empty";
export type PasteResult = { ok: true; text: string } | { ok: false; reason: PasteFailure };

export async function readPastedText(clipboard: { readText?: () => Promise<string> } | undefined): Promise<PasteResult> {
  if (!clipboard?.readText) return { ok: false, reason: "unsupported" };
  let raw: string;
  try {
    raw = await clipboard.readText();
  } catch {
    return { ok: false, reason: "denied" };
  }
  const text = raw.trim().slice(0, MAX_CHECK_CHARS);
  return text ? { ok: true, text } : { ok: false, reason: "empty" };
}

const BY_HAND = 'डिब्बे में उँगली 1-2 सेकंड दबाकर रखें, फिर "Paste" (चिपकाएँ) दबाएँ।';

export const PASTE_HINT_HI: Record<PasteFailure, string> = {
  unsupported: `यह browser सीधे चिपकाने नहीं देता। ${BY_HAND}`,
  denied: `browser ने चिपकाने की अनुमति नहीं दी। ${BY_HAND}`,
  empty: "अभी कोई copy किया हुआ message नहीं मिला। पहले SMS या WhatsApp में message पर उँगली दबाकर copy करें, फिर यह बटन दबाएँ।",
};
