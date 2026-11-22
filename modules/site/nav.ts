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
