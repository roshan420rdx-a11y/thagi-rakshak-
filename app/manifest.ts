import type { MetadataRoute } from "next";

// "home screen पर जोड़ें": घबराहट में ऐप जैसा एक बटन, इमरजेंसी पन्ने offline भी खुलते हैं
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ठगी रक्षक",
    short_name: "ठगी रक्षक",
    description: "डिजिटल ठगी के बाद क्या करें: पहले 60 मिनट से पैसा वापस पाने तक मदद। मुफ़्त।",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: "hi",
    theme_color: "#1D3A6B",
    background_color: "#F7F6F3",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
