"use client";

import { useEffect, useState } from "react";
import { IconSpeaker } from "./icons";
import { pickHindiVoice } from "./listen-voice";

// 🔊 सुनें: पन्ने के हिस्से हिंदी आवाज़ में पढ़कर सुनाना (एक या कई id, क्रम से)। mount से पहले, या जहाँ browser में
// हिंदी आवाज़ नहीं, वहाँ कुछ नहीं दिखता।
export function ListenButton({ targetId }: { targetId: string | string[] }) {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    // आवाज़ों की सूची कई browser में देर से आती है ("voiceschanged")
    const update = () => setVoice(pickHindiVoice(synth.getVoices?.() ?? []));
    update();
    synth.addEventListener?.("voiceschanged", update);
    return () => {
      synth.removeEventListener?.("voiceschanged", update);
      synth.cancel();
    };
  }, []);

  if (!voice) return null;

  function toggle() {
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const ids = Array.isArray(targetId) ? targetId : [targetId];
    const text = ids
      .map((id) => document.getElementById(id)?.innerText ?? "")
      .filter(Boolean)
      .join("\n");
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN";
    try {
      u.voice = voice;
    } catch {
      // कुछ browser में voice set न हो, तब भी lang से हिंदी में पढ़ने की कोशिश
    }
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
