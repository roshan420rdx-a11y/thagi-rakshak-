import { expect, test } from "vitest";
import { getSiteConfig, whatsappLink } from "@/modules/site";

test("सही नंबर माना जाता है", () =>
  expect(getSiteConfig({ NEXT_PUBLIC_WHATSAPP_NUMBER: "919876543210" }).whatsappNumber).toBe("919876543210"));

test.each(["+91 98765 43210", "9876543210", "91987654321", "abc", ""])("ग़लत नंबर '%s' → null", (v) =>
  expect(getSiteConfig({ NEXT_PUBLIC_WHATSAPP_NUMBER: v }).whatsappNumber).toBeNull());

test("नंबर न हो तो null और localhost", () =>
  expect(getSiteConfig({})).toEqual({ whatsappNumber: null, siteUrl: "http://localhost:3000" }));

test("siteUrl env से", () =>
  expect(getSiteConfig({ NEXT_PUBLIC_SITE_URL: "https://example.in" }).siteUrl).toBe("https://example.in"));

test("whatsappLink text encode करता है", () =>
  expect(whatsappLink("919876543210", "नमस्ते ?")).toBe("https://wa.me/919876543210?text=" + encodeURIComponent("नमस्ते ?")));

test("whatsappLink बिना text", () => expect(whatsappLink("919876543210")).toBe("https://wa.me/919876543210"));
