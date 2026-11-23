import type { GyanSlug } from "@/modules/gyan";

// "ठगी या असली?" अभ्यास (plan A3f) का एक message। नंबर छुपे/नकली हैं; किसी असली व्यक्ति या कंपनी का नहीं।
export type AbhyasItem = {
  id: string;
  channelHi: string; // कहाँ से आया: "SMS, एक mobile नंबर से", "call पर कहा गया"…
  text: string;
  scam: boolean;
  whyHi: string; // क्यों, और क्या करें (छोटा)
  gyan?: GyanSlug;
};
