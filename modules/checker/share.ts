import type { CheckResult, Level } from "./check";

// नतीजे की बातें (कभी "सुरक्षित" नहीं), और "परिवार को भेजें" का text।
// share में सिर्फ़ नतीजा और कारणों के नाम जाते हैं, user का message कभी नहीं।

export const LEVEL_COPY: Record<Level, { emoji: string; titleHi: string; bodyHi: string }> = {
  danger: {
    emoji: "🔴",
    titleHi: "ठगी के पक्के निशान",
    bodyHi: "रुकें। पैसे न भेजें, कोई ऐप न डालें, और OTP या PIN किसी को न बताएँ।",
  },
  warn: {
    emoji: "🟠",
    titleHi: "शक है",
    bodyHi: "सावधान रहें। नीचे दिए कारण पढ़ें, और किसी अपने से पूछे बिना पैसे न भेजें।",
  },
  no_signals: {
    emoji: "",
    titleHi: "आम निशान नहीं मिले",
    bodyHi: "ठगी के आम निशान नहीं मिले। फिर भी: OTP/PIN किसी को न बताएँ, अनजान link न खोलें, और शक हो तो पैसे न भेजें।",
  },
};

export const CHECK_LIMIT_HI = "यह जाँच सिर्फ़ आम निशान देखती है, हर ठगी नहीं पकड़ सकती।";

export function verdictShareText(result: CheckResult, pageUrl: string): string {
  const copy = LEVEL_COPY[result.level];
  const reasons = result.hits.map((h) => `- ${h.labelHi}`);
  return [
    `ठगी रक्षक से जाँच: ${copy.emoji} ${copy.titleHi}`.replace(/\s+/g, " "),
    ...reasons,
    "ऐसा message आए तो रुकें, पैसे न भेजें, OTP/PIN न बताएँ।",
    `आप भी जाँचें: ${pageUrl}`,
  ].join("\n");
}

// नंबर के बिना wa.me: WhatsApp ख़ुद पूछता है कि किसे भेजना है
export function whatsappShareLink(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
