// हर जवाब के साथ जाने वाले सुरक्षा headers। next.config.ts इन्हें इस्तेमाल करता है, और unit test इन्हें जाँचता है।
// Next.js अपना छोटा inline script ख़ुद डालता है, इसलिए script-src में 'unsafe-inline' रखना पड़ता है।
// बाकी सब कसा हुआ है: दूसरी साइट की script/frame/form नहीं, plugin बंद, और production में 'unsafe-eval' बंद।
// mic सिर्फ़ अपनी साइट के लिए ("पहले पूछो" का "बोलकर लिखें"); camera, location, payment बंद।

export type HeaderKV = { key: string; value: string };

export function buildCsp({ production }: { production: boolean }): string {
  // 'wasm-unsafe-eval': सिर्फ़ WebAssembly चलाने की अनुमति (photo से जाँच का OCR फ़ोन के अंदर), आम JS eval नहीं
  const script = ["'self'", "'unsafe-inline'", "'wasm-unsafe-eval'", ...(production ? [] : ["'unsafe-eval'"])];
  const connect = ["'self'", ...(production ? [] : ["ws:", "http://localhost:*"])];

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": script,
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:"],
    "font-src": ["'self'", "data:"],
    "connect-src": connect,
    "worker-src": ["'self'"],
    "manifest-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };
  return Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(" ")}`)
    .join("; ");
}

export function buildSecurityHeaders({ production }: { production: boolean }): HeaderKV[] {
  const headers: HeaderKV[] = [
    { key: "Content-Security-Policy", value: buildCsp({ production }) },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=(), payment=(), usb=(), interest-cohort=()" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "Cross-Origin-Resource-Policy", value: "same-site" },
    { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  ];
  // HSTS सिर्फ़ असली (https) चलाने पर; development में browser को https पर अटकाना ठीक नहीं
  if (production) headers.push({ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" });
  return headers;
}
