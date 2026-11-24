import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { StallError, withStallGuard } from "./stall";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const opts = (online: { v: boolean }) => ({ stallMs: 120_000, offlineStallMs: 10_000, isOnline: () => online.v });

test("काम पूरा हो जाए तो नतीजा, कोई रुकावट नहीं", async () => {
  const p = withStallGuard(async () => "ok", opts({ v: true }));
  await expect(p).resolves.toBe("ok");
});

test("internet बंद और 10 सेकंड कोई हलचल नहीं: अटकने की जगह साफ़ ग़लती", async () => {
  const online = { v: false };
  const p = withStallGuard(() => new Promise<string>(() => {}), opts(online));
  const caught = p.catch((e) => e);
  await vi.advanceTimersByTimeAsync(11_000);
  expect(await caught).toBeInstanceOf(StallError);
});

test("internet चालू हो तो धीमे download को 2 मिनट तक मौका; हर हलचल पर घड़ी फिर से", async () => {
  const online = { v: true };
  let tick = () => {};
  let settled = false;
  const p = withStallGuard((t) => {
    tick = t;
    return new Promise<string>(() => {});
  }, opts(online));
  p.catch(() => (settled = true));
  await vi.advanceTimersByTimeAsync(100_000);
  tick();
  await vi.advanceTimersByTimeAsync(100_000);
  expect(settled).toBe(false);
  await vi.advanceTimersByTimeAsync(25_000);
  expect(settled).toBe(true);
});

test("ग़लती अपने-आप आए तो वही ग़लती आगे", async () => {
  const p = withStallGuard(async () => {
    throw new Error("load failed");
  }, opts({ v: true }));
  await expect(p).rejects.toThrow("load failed");
});
