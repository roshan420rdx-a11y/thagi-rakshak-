"use client";

import { useEffect, useState } from "react";
import { checkMessage, MAX_CHECK_CHARS, type CheckResult } from "@/modules/checker";
import { PASTE_HINT_HI, readPastedText } from "@/modules/checker/paste";
import { SHARE_MISSED_HI, takeSharedText } from "@/modules/checker/share-inbox";
import { IconClipboard } from "@/components/ui/icons";
import { VerdictCard } from "./verdict-card";

// "पहले पूछो" का box। जाँच इसी फ़ोन के browser में होती है: message न server पर जाता है, न URL में, न कहीं सेव होता है।
// mount से पहले कुछ नहीं दिखता, इसलिए बिना JS के पन्ना सिर्फ़ 8 आम निशान दिखाता है।
export function CheckerBox({ pageUrl }: { pageUrl: string }) {
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [canPaste, setCanPaste] = useState(false);
  const [pasteHint, setPasteHint] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setCanPaste(typeof navigator.clipboard?.readText === "function");
    // Share → "ठगी रक्षक" से आए (plan A2f): message फ़ोन के डिब्बे से लेकर तुरंत जाँच; पता साफ़ (message कभी URL में नहीं था)
    if (new URLSearchParams(window.location.search).has("shared")) {
      window.history.replaceState(null, "", window.location.pathname);
      void takeSharedText(typeof caches === "undefined" ? undefined : caches).then((t) => {
        if (t) {
          setText(t);
          setResult(checkMessage(t));
        } else setPasteHint(SHARE_MISSED_HI);
      });
    }
  }, []);
  if (!mounted) return null;

  // एक tap: copy किया message डिब्बे में, और तुरंत जाँच। न मिले तो हाथ से Paste करने का तरीका।
  async function pasteAndCheck() {
    const r = await readPastedText(navigator.clipboard);
    if (!r.ok) {
      setPasteHint(PASTE_HINT_HI[r.reason]);
      return;
    }
    setPasteHint(null);
    setText(r.text);
    setResult(checkMessage(r.text));
  }

  return (
    <div className="space-y-3 rounded-[14px] border border-line bg-paper p-3">
      <form
        className="space-y-3"
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          setResult(checkMessage(text));
        }}
      >
        <label htmlFor="pucho-message" className="block text-[17px] font-bold">
          संदिग्ध message यहाँ चिपकाएँ
        </label>
        {canPaste ? (
          <button
            type="button"
            onClick={pasteAndCheck}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-2 border-brand bg-brand-bg px-4 font-bold text-brand transition hover:brightness-95 sm:w-auto"
          >
            <IconClipboard className="h-5 w-5" />
            copy किया message चिपकाएँ और जाँचें
          </button>
        ) : null}
        {pasteHint ? (
          <p role="status" className="rounded-[10px] bg-warn-bg p-3 text-[15px] font-semibold text-warn">
            {pasteHint}
          </p>
        ) : null}
        <textarea
          id="pucho-message"
          name="message"
          rows={5}
          maxLength={MAX_CHECK_CHARS}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setResult(null);
            setPasteHint(null);
          }}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          className="block w-full rounded-[10px] border border-line bg-surface p-3 text-[17px] text-ink"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={!text.trim()}
            className="min-h-12 rounded-[10px] bg-brand px-6 font-bold text-paper disabled:opacity-60"
          >
            जाँचें
          </button>
          {text ? (
            <button
              type="button"
              onClick={() => {
                setText("");
                setResult(null);
              }}
              className="min-h-12 rounded-[10px] border border-line bg-paper px-4 font-semibold text-ink"
            >
              मिटाएँ
            </button>
          ) : null}
        </div>
        <p className="text-[15px] text-muted">आपका message कहीं नहीं भेजा जाता, आपके फ़ोन में ही जाँचा जाता है।</p>
        {/* plan A2d: पहली बार फ़ोन चलाने वालों के लिए copy-paste, और call वालों के लिए "अपने शब्दों में" */}
        <details className="rounded-[10px] border border-line bg-surface p-3">
          <summary className="flex min-h-12 cursor-pointer items-center font-semibold text-brand">message copy करना नहीं आता, या call आई थी?</summary>
          <ol className="mt-1 list-decimal space-y-1 pl-6">
            <li>SMS या WhatsApp में उस message पर उँगली 1-2 सेकंड दबाकर रखें।</li>
            <li>ऊपर या नीचे आए &quot;Copy&quot; (दो काग़ज़ वाला निशान) को दबाएँ।</li>
            <li>यहाँ ऊपर के ख़ाली डिब्बे में उँगली दबाकर रखें, फिर &quot;Paste&quot; (चिपकाएँ) दबाएँ।</li>
            <li>&quot;जाँचें&quot; दबाएँ।</li>
          </ol>
          <p className="mt-2">
            call आई थी? तो जो कहा गया, वही अपने शब्दों में डिब्बे में लिख दें, जैसे &quot;OTP बताने को कहा&quot; या &quot;पुलिस बनकर video call
            पर रुकने को कहा&quot;।
          </p>
          <p className="mt-2">
            लिखना मुश्किल हो, तो keyboard पर 🎤 (mic) दबाकर बोलें, फ़ोन ख़ुद लिख देगा। (यह फ़ोन के keyboard की अपनी सुविधा है।)
          </p>
          <p className="mt-2">
            ठगी रक्षक को home screen पर जोड़ लिया है? तो WhatsApp या SMS में message पर उँगली दबाकर रखें, फिर Share (शेयर) में
            &quot;ठगी रक्षक&quot; चुनें: message सीधे यहाँ जाँचा जाएगा, कहीं भेजा नहीं जाएगा।
          </p>
        </details>
      </form>
      <div aria-live="polite">{result ? <VerdictCard result={result} pageUrl={pageUrl} /> : null}</div>
    </div>
  );
}
