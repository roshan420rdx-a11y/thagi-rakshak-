"use client";

import { useEffect, useState } from "react";
import { IconSpeaker } from "./icons";

// 🔊 सुनें: पन्ने के कदम हिंदी आवाज़ में पढ़कर सुनाना। mount से पहले, या जहाँ browser में आवाज़ नहीं, वहाँ कुछ नहीं दिखता।
export function ListenButton({ targetId }: { targetId: string }) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  if (!supported) return null;

  function toggle() {
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const text = document.getElementById(targetId)?.innerText ?? "";
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN";
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    synth.cancel();
    synth.speak(u);
    setSpeaking(true);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={speaking}
      className="inline-flex min-h-12 items-center gap-2 rounded-[10px] border border-line bg-paper px-3 font-semibold text-brand"
    >
      <IconSpeaker className="h-5 w-5" />
      {speaking ? "रोकें" : "सुनें"}
    </button>
  );
}
