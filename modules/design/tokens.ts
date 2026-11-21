// रंगों के tokens: spec (भाग 2, खंड 3.1)। light मान spec से जस के तस हैं; dark मान contrast-test पास करने के लिए चुने गए।
// app/globals.css में यही मान --<नाम> से हैं; tokens-sync.test.ts दोनों को मिलाकर रखता है।

export type TokenName =
  | "brand"
  | "brand-bg"
  | "danger"
  | "danger-bg"
  | "on-danger"
  | "warn"
  | "warn-bg"
  | "safe"
  | "safe-bg"
  | "on-safe"
  | "ink"
  | "muted"
  | "line"
  | "paper"
  | "surface";

export const TOKENS: Record<"light" | "dark", Record<TokenName, string>> = {
  light: {
    brand: "#1D3A6B",
    "brand-bg": "#EEF2F8",
    danger: "#B42318",
    "danger-bg": "#FEF3F2",
    "on-danger": "#FFFFFF",
    warn: "#B54708",
    "warn-bg": "#FFFAEB",
    safe: "#067647",
    "safe-bg": "#ECFDF3",
    "on-safe": "#FFFFFF",
    ink: "#101828",
    muted: "#475467",
    line: "#E4E7EC",
    paper: "#FFFFFF",
    surface: "#F7F6F3",
  },
  dark: {
    brand: "#9DB8EC",
    "brand-bg": "#1C2840",
    danger: "#F97066",
    "danger-bg": "#3A1714",
    "on-danger": "#1A0B09",
    warn: "#FDB022",
    "warn-bg": "#3A2A0C",
    safe: "#47CD89",
    "safe-bg": "#0F2E1F",
    "on-safe": "#06210F",
    ink: "#F2F4F7",
    muted: "#A6B0BF",
    line: "#2E3542",
    paper: "#1A1F27",
    surface: "#12151B",
  },
};

// text और उसके background के जोड़े: हर जोड़ा light और dark दोनों में कम से कम 4.5:1 हो
export const CONTRAST_PAIRS: ReadonlyArray<{ fg: TokenName; bg: TokenName; min: number }> = [
  { fg: "ink", bg: "paper", min: 4.5 },
  { fg: "ink", bg: "surface", min: 4.5 },
  { fg: "muted", bg: "paper", min: 4.5 },
  { fg: "muted", bg: "surface", min: 4.5 },
  { fg: "brand", bg: "paper", min: 4.5 },
  { fg: "brand", bg: "brand-bg", min: 4.5 },
  { fg: "danger", bg: "paper", min: 4.5 },
  { fg: "danger", bg: "danger-bg", min: 4.5 },
  { fg: "on-danger", bg: "danger", min: 4.5 },
  { fg: "warn", bg: "warn-bg", min: 4.5 },
  { fg: "safe", bg: "safe-bg", min: 4.5 },
  { fg: "on-safe", bg: "safe", min: 4.5 },
];
