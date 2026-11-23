import { expect, test } from "vitest";
import { MAX_CHECK_CHARS } from "./check";
import { SHARE_CACHE, SHARE_KEY, SHARE_PATH, combineShared, takeSharedText } from "./share-inbox";

test("share का रास्ता और डिब्बा तय", () => {
  expect(SHARE_PATH).toBe("/pucho/share");
  expect(SHARE_CACHE).toMatch(/share/);
  expect(SHARE_KEY.startsWith("/")).toBe(true);
});

test("combineShared: title, text, url जोड़कर; ख़ाली हटें; text में पहले से हो तो url दोबारा नहीं; हद से लंबा नहीं", () => {
  expect(combineShared("", "OTP बताइए", "")).toBe("OTP बताइए");
  expect(combineShared("SBI", "KYC update करें", "http://x.top")).toBe("SBI\nKYC update करें\nhttp://x.top");
  expect(combineShared(null, "यहाँ खोलें http://x.top", "http://x.top")).toBe("यहाँ खोलें http://x.top");
  expect(combineShared(undefined, "  \n ", undefined)).toBe("");
  expect(combineShared("", "क".repeat(MAX_CHECK_CHARS + 10), "").length).toBe(MAX_CHECK_CHARS);
});

function fakeCaches(initial?: string) {
  const store = new Map<string, string>();
  if (initial !== undefined) store.set(SHARE_KEY, initial);
  const opened: string[] = [];
  return {
    store,
    opened,
    api: {
      open: async (name: string) => {
        opened.push(name);
        return {
          match: async (k: string) => (store.has(k) ? new Response(store.get(k)) : undefined),
          delete: async (k: string) => store.delete(k),
        };
      },
    },
  };
}

test("takeSharedText: डिब्बे से message लेकर तुरंत मिटाए (दोबारा न मिले)", async () => {
  const c = fakeCaches("  आपका KYC अधूरा है  ");
  expect(await takeSharedText(c.api)).toBe("आपका KYC अधूरा है");
  expect(c.opened).toEqual([SHARE_CACHE]);
  expect(c.store.has(SHARE_KEY)).toBe(false);
  expect(await takeSharedText(c.api)).toBeNull();
});

test("takeSharedText: caches न हो, या डिब्बा ख़ाली हो, तो null", async () => {
  expect(await takeSharedText(undefined)).toBeNull();
  expect(await takeSharedText(fakeCaches().api)).toBeNull();
  expect(await takeSharedText(fakeCaches("   ").api)).toBeNull();
});
