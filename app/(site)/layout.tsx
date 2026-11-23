import type { ReactNode } from "react";
import { BottomNav } from "@/components/site/bottom-nav";
import { SiteHeader } from "@/components/site/site-header";

// आम पन्नों का ढाँचा: header + content + फ़ोन का नीचे वाला menu (/turant इस समूह में नहीं है, उसका अपना सादा ढाँचा है)
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-[680px] px-4 py-4 md:py-6">{children}</main>
      <BottomNav />
    </>
  );
}
