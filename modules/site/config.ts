import { z } from "zod";

// site की settings (env से)। WhatsApp नंबर सिर्फ़ "91 + 10 अंक" रूप में माना जाता है; ग़लत रूप हो तो null (बटन नहीं दिखेगा)
const WhatsAppNumber = z.string().regex(/^91\d{10}$/);

const Email = z.string().trim().email();

export type SiteConfig = {
  whatsappNumber: string | null;
  siteUrl: string;
  orgName: string | null; // सेवा चलाने वाली संस्था (company बनने के बाद)
  grievanceName: string | null; // शिकायत अधिकारी
  grievanceEmail: string | null;
};

const text = (v: string | undefined) => (v && v.trim() ? v.trim() : null);

export function getSiteConfig(env: Record<string, string | undefined> = process.env): SiteConfig {
  const wa = WhatsAppNumber.safeParse(env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "");
  const email = Email.safeParse(env.NEXT_PUBLIC_GRIEVANCE_EMAIL ?? "");
  return {
    whatsappNumber: wa.success ? wa.data : null,
    siteUrl: env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    orgName: text(env.NEXT_PUBLIC_ORG_NAME),
    grievanceName: text(env.NEXT_PUBLIC_GRIEVANCE_NAME),
    grievanceEmail: email.success ? email.data : null,
  };
}

export function whatsappLink(number: string, text?: string): string {
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
