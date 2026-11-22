import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";
import { evaluateRights } from "@/modules/rules-engine";
import { BASE_2027 } from "@/modules/rules-engine/test-helpers";
import { ombudsmanWindow } from "./rbios-2026";

const find = (r: ReturnType<typeof evaluateRights>) => r.find((x) => x.ruleId === "rbios2026.ombudsmanWindow");

test("बैंक को नहीं बताया → यह नियम नहीं (पहले बैंक ज़रूरी)", () => {
  expect(find(evaluateRights({ ...BASE_2027, reportedToBankOn: null }, "2027-03-12"))).toBeUndefined();
});

test("2027 की ठगी: बैंक के 45 दिन (76Q), फिर 90 दिन", () => {
  const r = find(evaluateRights({ ...BASE_2027, reportedToBankOn: "2027-03-01", crossBorder: false }, "2027-03-12"))!;
  expect(r.status).toBe("likely");
  expect(r.deadlines.map((d) => d.date)).toEqual(["2027-04-15", "2027-07-14"]);
});

test("2027 की ठगी, विदेश वाला लेन-देन: बैंक के 60 दिन", () => {
  const r = find(evaluateRights({ ...BASE_2027, reportedToBankOn: "2027-03-01", crossBorder: true }, "2027-03-12"))!;
  expect(r.deadlines[0].date).toBe("2027-04-30");
});

test("2027 से पहले की ठगी: बैंक के 90 दिन (2025 directions), फिर 90 दिन", () => {
  const r = find(
    evaluateRights({ ...BASE_2027, txnDate: "2026-11-10", reportedTo1930On: "2026-11-10", reportedToBankOn: "2026-11-11" }, "2026-11-22"),
  )!;
  expect(r.deadlines.map((d) => d.date)).toEqual(["2027-02-09", "2027-05-10"]);
});

test("90 दिन की सीमा निकल गई → साफ़ नहीं (बैंक का बाद वाला जवाब हो तो उससे गिनें)", () => {
  const r = find(evaluateRights({ ...BASE_2027, reportedToBankOn: "2027-01-02" }, "2027-08-01"))!;
  expect(r.status).toBe("unclear");
  expect(r.reasonsHi.join(" ")).toContain("आख़िरी बातचीत");
});

test("RBI का quote मूल text में", () => {
  const norm = (s: string) => s.replace(/\s+/g, " ").trim();
  const text = readFileSync(path.resolve(__dirname, "../../..", ombudsmanWindow.source.file), "utf8");
  expect(norm(text)).toContain(norm(ombudsmanWindow.source.quote));
});
