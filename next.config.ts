import type { NextConfig } from "next";
import { buildSecurityHeaders } from "./modules/security";

// हर जवाब के साथ सुरक्षा headers (CSP, HSTS आदि); नियम modules/security/headers.ts में
const securityHeaders = buildSecurityHeaders({ production: process.env.NODE_ENV === "production" });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // CSS HTML के अंदर: धीमे network पर अलग CSS file का दूसरा round-trip नहीं (Slow 3G पर /turant 4.4 → 2.3 सेकंड, e2e-turant)।
  // CSP में style-src 'unsafe-inline' पहले से है। साइट की पूरी CSS एक ही है (Tailwind), इसलिए हर पन्ने पर वही।
  experimental: { inlineCss: true },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
