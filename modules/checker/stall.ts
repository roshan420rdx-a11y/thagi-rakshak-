// photo से जाँच (TR-36) अटके नहीं: पढ़ने का सामान आधा आकर internet चला जाए, तो tesseract चुपचाप रुका रह सकता है।
// तब "हलचल" (progress) बंद हो जाती है। इतनी देर कोई हलचल न हो तो साफ़ ग़लती, ताकि पन्ना "photo पढ़ी नहीं जा सकी" कह सके:
// internet बंद हो तो 10 सेकंड, चालू हो तो 2 मिनट (धीमे 2G पर भी करीब 6 MB का पहला download पूरा हो सके)।
export class StallError extends Error {
  constructor() {
    super("कोई हलचल नहीं (शायद internet नहीं)");
    this.name = "StallError";
  }
}

export function withStallGuard<T>(
  run: (tick: () => void) => Promise<T>,
  opts: { stallMs: number; offlineStallMs: number; isOnline: () => boolean; checkEveryMs?: number },
): Promise<T> {
  let last = Date.now();
  let timer: ReturnType<typeof setInterval> | undefined;
  const stalled = new Promise<never>((_, reject) => {
    timer = setInterval(() => {
      const limit = opts.isOnline() ? opts.stallMs : opts.offlineStallMs;
      if (Date.now() - last > limit) reject(new StallError());
    }, opts.checkEveryMs ?? 1000);
  });
  const work = run(() => {
    last = Date.now();
  });
  return Promise.race([work, stalled]).finally(() => clearInterval(timer));
}
