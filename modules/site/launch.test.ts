import { expect, test } from "vitest";
import { launchChecks } from "@/modules/site/launch";

const ids = (env: Record<string, string>) => Object.fromEntries(launchChecks(env).map((c) => [c.id, c.ok]));

test("8 जाँचें, तय क्रम", () =>
  expect(launchChecks({}).map((c) => c.id)).toEqual(["site_url", "org", "grievance", "whatsapp", "legal_reviewed", "banks_live", "rules_owner", "gyan_reviewed"]));

test("ख़ाली env → env वाली सारी जाँचें ❌", () =>
  expect(ids({})).toMatchObject({ site_url: false, org: false, grievance: false, whatsapp: false }));

test("http (https नहीं) वाला पता ❌", () => expect(ids({ NEXT_PUBLIC_SITE_URL: "http://x.in" }).site_url).toBe(false));

test("सब set → env वाली जाँचें ✅", () =>
  expect(
    ids({
      NEXT_PUBLIC_SITE_URL: "https://x.in",
      NEXT_PUBLIC_ORG_NAME: "संस्था",
      NEXT_PUBLIC_GRIEVANCE_NAME: "अधिकारी",
      NEXT_PUBLIC_GRIEVANCE_EMAIL: "a@x.in",
      NEXT_PUBLIC_WHATSAPP_NUMBER: "919876543210",
    }),
  ).toMatchObject({ site_url: true, org: true, grievance: true, whatsapp: true }));

test("आज के data पर: legal मसौदा, बैंक live नहीं, नियम और ज्ञानकोश की दूसरी जाँच बाकी → ❌", () =>
  expect(ids({})).toMatchObject({ legal_reviewed: false, banks_live: false, rules_owner: false, gyan_reviewed: false }));

test("कोई env मान output में नहीं छपता (secret सुरक्षित)", () => {
  const out = JSON.stringify(launchChecks({ NEXT_PUBLIC_GRIEVANCE_EMAIL: "secret-person@private.in", NEXT_PUBLIC_ORG_NAME: "गुप्त-नाम-123" }));
  expect(out).not.toContain("secret-person");
  expect(out).not.toContain("गुप्त-नाम-123");
});

test("हर जाँच के साथ ठीक करने का तरीका", () => {
  for (const c of launchChecks({})) expect(c.fixHi.length).toBeGreaterThan(10);
});
