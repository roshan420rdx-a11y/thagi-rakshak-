import { apkFile } from "@/content/gyan/hi/apk-file";
import { customerCareFake } from "@/content/gyan/hi/customer-care-fake";
import { digitalArrest } from "@/content/gyan/hi/digital-arrest";
import { taskInvestment } from "@/content/gyan/hi/task-investment";
import { upiPinQr } from "@/content/gyan/hi/upi-pin-qr";
import type { TurantSlug } from "@/modules/scams";
import type { GyanPage } from "./types";

export const GYAN_PAGES: readonly GyanPage[] = [digitalArrest, customerCareFake, upiPinQr, taskInvestment, apkFile];

export function getGyanPage(slug: string): GyanPage | undefined {
  return GYAN_PAGES.find((p) => p.slug === slug);
}

// किसी /turant पन्ने से जुड़े ज्ञानकोश पन्ने
export function gyanForTurant(t: TurantSlug): GyanPage[] {
  return GYAN_PAGES.filter((p) => p.turantSlug === t);
}
