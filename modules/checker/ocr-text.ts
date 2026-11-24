// photo/screenshot से पढ़े text की सफ़ाई (TR-36)। OCR हर दिखी लाइन अलग देता है; जाँच के नियम लाइन के पार नहीं देखते,
// इसलिए एक ही बात की लाइनें जोड़ना ज़रूरी है। खाली लाइन से अलग हिस्से अलग रहते हैं।
import { MAX_CHECK_CHARS } from "./check";

export function cleanOcrText(raw: string): string {
  return raw
    .replace(/\r/g, "")
    .replace(/-\n(?=\S)/g, "")
    .split(/\n\s*\n+/)
    .map((part) =>
      part
        .replace(/\s*\n\s*/g, " ")
        .replace(/[ \t]+/g, " ")
        .replace(/\s+\|(?=\s|$)/g, "।") // देवनागरी पूर्ण विराम अक्सर | पढ़ा जाता है
        .replace(/\s+([।.,!?])/g, "$1")
        .trim(),
    )
    .filter(Boolean)
    .join("\n")
    .slice(0, MAX_CHECK_CHARS);
}
