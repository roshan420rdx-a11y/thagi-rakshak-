import { expect, test } from "vitest";
import { GET, POST } from "./route";

test("server वाला share रास्ता: body पढ़े बिना /pucho?shared=0 पर (message server पर कभी पढ़ा/रखा नहीं जाता)", async () => {
  let read = false;
  const body = new ReadableStream({
    pull() {
      read = true;
      throw new Error("body पढ़ी गई");
    },
  });
  // route body को छूता ही नहीं (request लेता भी नहीं); stream कभी न पढ़ी जाए
  void new Request("https://example.org/pucho/share", { method: "POST", body, duplex: "half" } as RequestInit);
  const res = POST();
  expect(res.status).toBe(303);
  expect(res.headers.get("location")).toBe("/pucho?shared=0");
  expect(read).toBe(false);
});

test("GET /pucho/share → /pucho", async () => {
  const res = GET();
  expect(res.status).toBe(303);
  expect(res.headers.get("location")).toBe("/pucho");
});
