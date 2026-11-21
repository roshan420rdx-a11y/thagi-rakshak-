// launch से पहले क्या बाकी है। सिर्फ़ ✅/❌ और ठीक करने का तरीका बताता है; कोई env का मान कभी नहीं छापता।
// चलाने का तरीका: npm run launch-check (docs/DEPLOYMENT.md)
import { BANKS, liveChannels } from "@/modules/banks";
import { GYAN_PAGES } from "@/modules/gyan";
import { RULES } from "@/modules/rules-engine";
import { getSiteConfig } from "./config";
import { LEGAL_VERSION } from "./legal";

export type LaunchCheck = { id: string; ok: boolean; labelHi: string; fixHi: string };

export function launchChecks(env: Record<string, string | undefined> = process.env): LaunchCheck[] {
  const cfg = getSiteConfig(env);
  const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "";
  const liveBanks = BANKS.filter((b) => liveChannels(b).length > 0).length;
  return [
    {
      id: "site_url",
      ok: /^https:\/\/[^/]+/.test(siteUrl),
      labelHi: "साइट का असली पता (https) set है",
      fixHi: "Render की settings में NEXT_PUBLIC_SITE_URL में https वाला पता डालें",
    },
    {
      id: "org",
      ok: cfg.orgName !== null,
      labelHi: "सेवा चलाने वाली संस्था का नाम set है",
      fixHi: "NEXT_PUBLIC_ORG_NAME में संस्था का नाम डालें (मालिक तय करेंगे)",
    },
    {
      id: "grievance",
      ok: cfg.grievanceName !== null && cfg.grievanceEmail !== null,
      labelHi: "शिकायत अधिकारी का नाम और email set हैं",
      fixHi: "NEXT_PUBLIC_GRIEVANCE_NAME और NEXT_PUBLIC_GRIEVANCE_EMAIL डालें",
    },
    {
      id: "whatsapp",
      ok: cfg.whatsappNumber !== null,
      labelHi: "WhatsApp Business नंबर set है",
      fixHi: "NEXT_PUBLIC_WHATSAPP_NUMBER (91 + 10 अंक) डालें; TR-13 के बाद ज़रूरी",
    },
    {
      id: "legal_reviewed",
      ok: !LEGAL_VERSION.includes("मसौदा"),
      labelHi: "legal पन्नों की वकील से जाँच हो चुकी है",
      fixHi: "वकील की जाँच के बाद modules/site/legal.ts में LEGAL_VERSION बदलें",
    },
    {
      id: "banks_live",
      ok: liveBanks >= 5,
      labelHi: `कम से कम 5 बैंकों के रास्ते दो-जाँच वाले हैं (अभी ${liveBanks})`,
      fixHi: "मालिक docs/verify/BANKS.md के links खोलकर जाँच 2 करें",
    },
    {
      id: "rules_owner",
      ok: RULES.every((r) => r.verifiedBy.includes("owner")),
      labelHi: "RBI वाले सारे नियमों पर मालिक की दूसरी जाँच हो चुकी है",
      fixHi: "मालिक docs/sources/rbi/README.md के links खोलकर नियम मिलाएँ",
    },
    {
      id: "gyan_reviewed",
      ok: GYAN_PAGES.every((p) => p.reviewer !== null),
      labelHi: "ज्ञानकोश के पन्नों की विशेषज्ञ से जाँच हो चुकी है",
      fixHi: "किसी वकील या बैंक अधिकारी से पन्ने जँचवाकर content में reviewer भरें",
    },
  ];
}
