import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SwRegister } from "@/components/offline/sw-register";
import { SiteFooter } from "@/components/ui/site-footer";
import { getSiteConfig } from "@/modules/site";
import { TEXT_SIZE_PRESCRIPT } from "@/modules/ui/text-size";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteConfig().siteUrl),
  title: "ठगी रक्षक",
  description: "डिजिटल ठगी के बाद क्या करें: पहले 60 मिनट से पैसा वापस पाने तक हर कदम पर मदद। मुफ़्त।",
};

export const viewport: Viewport = {
  themeColor: "#1D3A6B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: पन्ना दिखने से पहले वाली script <html> पर data-akshar लगा सकती है
    <html lang="hi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: TEXT_SIZE_PRESCRIPT }} />
      </head>
      <body>
        {children}
        <SiteFooter />
        <SwRegister />
      </body>
    </html>
  );
}
