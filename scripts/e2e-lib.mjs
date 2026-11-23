// सारे browser-जाँच (e2e) scripts की साझा चीज़ें: server का पता, browser, check/assert/withPage,
// आज की तारीख़ (भारत के समय से), और "सुनें" की जाँच के लिए नकली आवाज़। चलाने से पहले: npm run build && npm start
import { chromium } from "playwright";

export const BASE = process.env.BASE_URL ?? "http://localhost:3000";
export const PHONE = { width: 360, height: 740 };
export const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
export const browser = await chromium.launch();

let failed = false;

// एक जाँच। पहली गलती के बाद बाकी जाँचें नहीं चलतीं (एक साफ़ गलती, लंबी सूची नहीं)
export async function check(name, fn) {
  if (failed) return;
  try {
    await fn();
    console.log(`✓ ${name}`);
  } catch (err) {
    failed = true;
    console.log(`✗ ${name}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// "कोई request नहीं" वाली जाँचों के लिए। Next.js अपने ही पन्नों के link screen पर आते ही उनका ढाँचा (GET, सिर्फ़
// ?_rsc=…) और उनकी JS file (GET /_next/static/…, build से तय नाम) पहले से ले आता है; इनमें कोई user data नहीं, सिर्फ़
// इन्हें छोड़ा जाता है। बाकी हर request गिनी जाती है, और अगर किसी request (prefetch भी) के पते या body में user की
// लिखी कोई बात हो, तो वह भी।
export function watchRequests(page, secrets = []) {
  const seen = [];
  const origin = new URL(BASE).origin;
  page.on("request", (r) => {
    const url = r.url();
    const u = new URL(url);
    const keys = [...u.searchParams.keys()];
    const sameGet = u.origin === origin && r.method() === "GET";
    const prefetch = sameGet && ((keys.length === 1 && keys[0] === "_rsc") || (keys.length === 0 && u.pathname.startsWith("/_next/static/")));
    const text = `${decodeURIComponent(url)} ${r.postData() ?? ""}`;
    if (!prefetch || secrets.some((s) => s && text.includes(s))) seen.push(url);
  });
  return seen;
}

// print वाला असली PDF (A4) बनाकर उसके पन्ने गिनना (ख़ाली पन्ने भी गिने जाते हैं)
export async function pdfPageCount(page) {
  await page.emulateMedia({ media: "print" });
  const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
  await page.emulateMedia({ media: "screen" });
  return (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
}

// नया context + page; काम के बाद अपने-आप बंद
export async function withPage(options, fn) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  try {
    return await fn(page, context);
  } finally {
    await context.close();
  }
}

// नकली आवाज़: जो बोला जाता, वह window.__spoken में ({ text, lang, voice })। आवाज़ें बाद में बदलनी हों तो
// window.__voices में डालकर window.__fireVoices() चलाएँ ("voiceschanged" जैसा)।
export async function installSpeechStub(context, { voices = [{ lang: "hi-IN", name: "Hindi", localService: true }] } = {}) {
  await context.addInitScript((initial) => {
    const listeners = [];
    window.__spoken = [];
    window.__voices = initial;
    window.__fireVoices = () => listeners.forEach((f) => f());
    // असली utterance नकली voice object नहीं लेता, इसलिए वह भी नकली
    window.SpeechSynthesisUtterance = class {
      constructor(t) {
        this.text = t;
      }
    };
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak: (u) => window.__spoken.push({ text: u.text, lang: u.lang, voice: u.voice?.name }),
        cancel: () => {},
        getVoices: () => window.__voices,
        addEventListener: (_e, f) => listeners.push(f),
        removeEventListener: () => {},
      },
    });
  }, voices);
}

export async function finish() {
  await browser.close();
  process.exit(failed ? 1 : 0);
}
