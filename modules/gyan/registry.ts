import { aepsAngootha } from "@/content/gyan/hi/aeps-angootha";
import { apkFile } from "@/content/gyan/hi/apk-file";
import { apnaBankar } from "@/content/gyan/hi/apna-bankar";
import { bijliBill } from "@/content/gyan/hi/bijli-bill";
import { customerCareFake } from "@/content/gyan/hi/customer-care-fake";
import { digitalArrest } from "@/content/gyan/hi/digital-arrest";
import { galtiSePaise } from "@/content/gyan/hi/galti-se-paise";
import { kycLink } from "@/content/gyan/hi/kyc-link";
import { loanApp } from "@/content/gyan/hi/loan-app";
import { naukriFee } from "@/content/gyan/hi/naukri-fee";
import { lotteryInaam } from "@/content/gyan/hi/lottery-inaam";
import { sextortion } from "@/content/gyan/hi/sextortion";
import { simSwap } from "@/content/gyan/hi/sim-swap";
import { taskInvestment } from "@/content/gyan/hi/task-investment";
import { upiPinQr } from "@/content/gyan/hi/upi-pin-qr";
import type { TurantSlug } from "@/modules/scams";
import type { GyanPage, GyanSlug } from "./types";

export const GYAN_PAGES: readonly GyanPage[] = [
  digitalArrest,
  customerCareFake,
  upiPinQr,
  taskInvestment,
  apkFile,
  bijliBill,
  lotteryInaam,
  sextortion,
  loanApp,
  kycLink,
  apnaBankar,
  galtiSePaise,
  aepsAngootha,
  simSwap,
  naukriFee,
];

// /gyan पर समूह: 15 पन्नों की लंबी सूची की जगह, ठगी के तरीके के हिसाब से (हर पन्ना ठीक एक समूह में; test पक्का करता है)
export const GYAN_GROUPS: readonly { titleHi: string; slugs: readonly GyanSlug[] }[] = [
  { titleHi: "डर दिखाकर ठगी", slugs: ["digital-arrest", "bijli-bill", "kyc-link", "sextortion", "loan-app"] },
  { titleHi: "लालच देकर ठगी", slugs: ["task-investment", "naukri-fee", "lottery-inaam"] },
  { titleHi: "अपना या मददगार बनकर ठगी", slugs: ["customer-care-fake", "apna-bankar", "galti-se-paise"] },
  { titleHi: "PIN, QR, ऐप, SIM या अंगूठे से ठगी", slugs: ["upi-pin-qr", "apk-file", "aeps-angootha", "sim-swap"] },
];

export function getGyanPage(slug: string): GyanPage | undefined {
  return GYAN_PAGES.find((p) => p.slug === slug);
}

// किसी /turant पन्ने से जुड़े ज्ञानकोश पन्ने
export function gyanForTurant(t: TurantSlug): GyanPage[] {
  return GYAN_PAGES.filter((p) => p.turantSlug === t);
}
