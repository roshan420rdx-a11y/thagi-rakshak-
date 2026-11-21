import { z } from "zod";

// site की settings (env से)। WhatsApp नंबर सिर्फ़ "91 + 10 अंक" रूप में माना जाता है; ग़लत रूप हो तो null (बटन नहीं दिखेगा)
const WhatsAppNumber = z.string().regex(/^91\d{10}$/);

export type SiteConfig = { whatsappNumber: string | null; siteUrl: string };

export function getSiteConfig(env: Record<string, string | undefined> = process.env): SiteConfig {
  const wa = WhatsAppNumber.safeParse(env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "");
  return {
    whatsappNumber: wa.success ? wa.data : null,
    siteUrl: env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  };
}

export function whatsappLink(number: string, text?: string): string {
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
