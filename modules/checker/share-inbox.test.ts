import { expect, test } from "vitest";
import { MAX_CHECK_CHARS } from "./check";
import { MAX_SHARE_IMAGE_BYTES, SHARE_CACHE, SHARE_IMAGE_KEY, SHARE_KEY, SHARE_PATH, combineShared, pickSharedImage, takeSharedImage, takeSharedText } from "./share-inbox";

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

test("Share से photo: अलग key, और हद (बहुत बड़ी photo नहीं)", () => {
  expect(SHARE_IMAGE_KEY.startsWith("/")).toBe(true);
  expect(SHARE_IMAGE_KEY).not.toBe(SHARE_KEY);
  expect(MAX_SHARE_IMAGE_BYTES).toBe(15 * 1024 * 1024);
});

test("pickSharedImage: पहली असली photo; text, ख़ाली, ग़ैर-photo या हद से बड़ी file नहीं", () => {
  const png = new Blob(["x"], { type: "image/png" });
  const jpg = new Blob(["yy"], { type: "image/jpeg" });
  expect(pickSharedImage([png, jpg], 100)).toBe(png);
  expect(pickSharedImage(["text", new Blob([], { type: "image/png" }), jpg], 100)).toBe(jpg);
  expect(pickSharedImage([new Blob(["%PDF"], { type: "application/pdf" })], 100)).toBeNull();
  expect(pickSharedImage([new Blob(["x".repeat(101)], { type: "image/png" })], 100)).toBeNull();
  expect(pickSharedImage([null, undefined, 5, {}], 100)).toBeNull();
  expect(pickSharedImage([], 100)).toBeNull();
});

function fakeImageCaches(blob?: Blob) {
  const store = new Map<string, Blob>();
  if (blob) store.set(SHARE_IMAGE_KEY, blob);
  return {
    store,
    api: {
      open: async () => ({
        match: async (k: string) => (store.has(k) ? new Response(store.get(k)) : undefined),
        delete: async (k: string) => store.delete(k),
      }),
    },
  };
}

test("takeSharedImage: डिब्बे से photo लेकर तुरंत मिटाए; ख़ाली/ग़ैर-photo/न हो तो null", async () => {
  const c = fakeImageCaches(new Blob(["png-bytes"], { type: "image/png" }));
  const got = await takeSharedImage(c.api);
  expect(got?.type).toBe("image/png");
  expect(await got?.text()).toBe("png-bytes");
  expect(c.store.has(SHARE_IMAGE_KEY)).toBe(false);
  expect(await takeSharedImage(c.api)).toBeNull();
  expect(await takeSharedImage(undefined)).toBeNull();
  expect(await takeSharedImage(fakeImageCaches(new Blob(["<html>"], { type: "text/html" })).api)).toBeNull();
  expect(await takeSharedImage(fakeImageCaches(new Blob([], { type: "image/png" })).api)).toBeNull();
});
