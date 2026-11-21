import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SwRegister } from "@/components/offline/sw-register";
import { SiteFooter } from "@/components/ui/site-footer";
import "./globals.css";

export const metadata: Metadata = {
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
    <html lang="hi">
      <body>
        {children}
        <SiteFooter />
        <SwRegister />
      </body>
    </html>
  );
}
