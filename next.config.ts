import type { NextConfig } from "next";
import { buildSecurityHeaders } from "./modules/security";

// हर जवाब के साथ सुरक्षा headers (CSP, HSTS आदि); नियम modules/security/headers.ts में
const securityHeaders = buildSecurityHeaders({ production: process.env.NODE_ENV === "production" });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
