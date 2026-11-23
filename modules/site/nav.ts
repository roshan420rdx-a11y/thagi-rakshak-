// मुख्य menu। जो सुविधा अभी बनी नहीं (live: false), उसका tab नहीं दिखता।
export type NavIcon = "home" | "search" | "case" | "shield";
export type NavItem = { href: string; labelHi: string; icon: NavIcon; live: boolean };

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", labelHi: "होम", icon: "home", live: true },
  { href: "/pucho", labelHi: "पूछो", icon: "search", live: true },
  { href: "/case", labelHi: "मेरा केस", icon: "case", live: true }, // अभी फ़ोन वाला रूप (plan B0); खाते वाला चरण B में
  { href: "/bharosa", labelHi: "भरोसा", icon: "shield", live: true },
];

export function liveNavItems(): NavItem[] {
  return NAV_ITEMS.filter((n) => n.live);
}

// desktop पर header के नीचे वाली पट्टी: पूरी साइट के मुख्य हिस्से (फ़ोन पर नीचे वाला 4 tab का menu ही रहता है)
export type HeaderNavItem = { href: string; labelHi: string };

export const HEADER_NAV: readonly HeaderNavItem[] = [
  { href: "/", labelHi: "होम" },
  { href: "/pucho", labelHi: "पहले पूछो" },
  { href: "/gyan", labelHi: "ज्ञानकोश" },
  { href: "/case", labelHi: "मेरा केस" },
  { href: "/arzi", labelHi: "अर्ज़ियाँ" },
  { href: "/nambar", labelHi: "ज़रूरी नंबर" },
  { href: "/bharosa", labelHi: "भरोसा" },
];

// menu में कौन-सा link चालू पन्ने का है: होम सिर्फ़ "/" पर, बाकी अपने नीचे के पन्नों (/gyan/...) पर भी
export function isCurrentPath(href: string, current: string): boolean {
  return href === "/" ? current === "/" : current === href || current.startsWith(`${href}/`);
}
