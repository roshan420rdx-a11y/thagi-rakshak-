"use client";

import { useEffect, useRef, useState } from "react";

// "बोलकर लिखें" (TR-35): browser की अपनी आवाज़ से text वाली सुविधा (Web Speech API), हिंदी में। जो बोला, वह डिब्बे में
// जुड़ता है और तुरंत जाँच होती है। browser में सुविधा न हो तो बटन नहीं दिखता (तब keyboard का 🎤 वाला तरीका)।
// सच साफ़ लिखा है: आवाज़ से text browser बनाता है (Chrome में Google की सेवा से); हमारे server पर कुछ नहीं आता।
type RecResult = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type Rec = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((e: RecResult) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
};
type RecCtor = new () => Rec;

function recognizer(): RecCtor | null {
  const w = window as unknown as { SpeechRecognition?: RecCtor; webkitSpeechRecognition?: RecCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function VoiceInput({ onText }: { onText: (text: string) => void }) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const rec = useRef<Rec | null>(null);

  useEffect(() => {
    setSupported(recognizer() !== null);
    return () => rec.current?.stop();
  }, []);
  if (!supported) return null;

  function start() {
    const Ctor = recognizer();
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = "hi-IN";
    r.interimResults = false;
    r.continuous = false;
    r.maxAlternatives = 1;
    r.onresult = (e) => {
      const said = Array.from(e.results)
        .map((x) => x[0]?.transcript ?? "")
        .join(" ")
        .trim();
      if (said) onText(said);
    };
    r.onerror = (e) => {
      setProblem(
        e.error === "not-allowed" || e.error === "service-not-allowed"
          ? "mic की अनुमति नहीं मिली। browser में mic की अनुमति दें, या keyboard के 🎤 से बोलें।"
          : "आवाज़ साफ़ नहीं आई। फिर से बटन दबाकर बोलें।",
      );
      setListening(false);
    };
    r.onend = () => setListening(false);
    rec.current = r;
    setProblem(null);
    setListening(true);
    try {
      r.start();
    } catch {
      setListening(false);
    }
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={listening ? () => rec.current?.stop() : start}
        className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-2 px-4 font-bold transition hover:brightness-95 sm:w-auto ${
          listening ? "border-danger bg-danger-bg text-danger" : "border-brand bg-paper text-brand"
        }`}
      >
        <MicIcon />
        {listening ? "सुन रहे हैं… बोलिए (रोकें)" : "बोलकर लिखें"}
      </button>
      <p aria-live="polite" className="text-[14px] text-muted">
        {problem ?? "जो हुआ, अपने शब्दों में बोलें। आवाज़ से text आपका browser बनाता है (Chrome में Google की सेवा से); हमारे पास कुछ नहीं आता।"}
      </p>
    </div>
  );
}

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" />
    </svg>
  );
}
