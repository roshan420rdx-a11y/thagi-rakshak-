"use client";

import { useEffect, useState } from "react";

// "फ़ोन की home screen पर जोड़ें": browser जब install का मौका दे (beforeinstallprompt), तभी बटन दिखता है।
// जुड़ने के बाद साइट ऐप की तरह खुलती है, और इमरजेंसी पन्ने internet के बिना भी।
type InstallEvent = Event & { prompt: () => Promise<void> };

export function InstallButton() {
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as InstallEvent);
    };
    const onInstalled = () => {
      setDone(true);
      setEvt(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (done) return <p className="font-semibold text-safe">ठगी रक्षक आपकी home screen पर जुड़ गया।</p>;
  if (!evt) return null;
  return (
    <button
      type="button"
      onClick={async () => {
        await evt.prompt();
        setEvt(null);
      }}
      className="flex min-h-12 w-full items-center justify-center rounded-xl border border-line bg-paper px-4 font-semibold text-brand"
    >
      फ़ोन की home screen पर जोड़ें (ऐप की तरह, internet के बिना भी)
    </button>
  );
}
