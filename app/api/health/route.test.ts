import { expect, test } from "vitest";
import { GET } from "./route";

test("health ok देता है", async () => {
  const res = await GET();
  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({ status: "ok", service: "thagi-rakshak" });
});
