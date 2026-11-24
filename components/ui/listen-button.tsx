"use client";

import { useEffect, useState } from "react";
import { IconSpeaker } from "./icons";
import { pickHindiVoice } from "./listen-voice";

// 🔊 सुनें: पन्ने के हिस्से हिंदी आवाज़ में पढ़कर सुनाना (एक या कई id, क्रम से)। mount से पहले, या जहाँ browser में
// हिंदी आवाज़ नहीं, वहाँ कुछ नहीं दिखता।
// बोलने वाला text: [data-no-listen] वाले हिस्से ("हो गया" जैसे बटन) छोड़कर। innerText ही, ताकि लाइनों पर ठहराव रहे।
function readableText(el: HTMLElement | null): string {
  if (!el) return "";
  const skip = Array.from(el.querySelectorAll<HTMLElement>("[data-no-listen]"));
  const prev = skip.map((n) => n.style.display);
  skip.forEach((n) => (n.style.display = "none"));
  try {
    return el.innerText;
  } finally {
    skip.forEach((n, i) => (n.style.display = prev[i]));
  }
}

// label: बटन का नाम (जैसे "पत्र सुनें"); transform: बोलने से पहले text बदलना (जैसे [ ] को "ख़ाली जगह")
export function ListenButton({ targetId, label = "सुनें", transform }: { targetId: string | string[]; label?: string; transform?: (text: string) => string }) {
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
    const raw = ids
      .map((id) => readableText(document.getElementById(id)))
      .filter(Boolean)
      .join("\n");
    const text = transform ? transform(raw) : raw;
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
      {speaking ? "रोकें" : label}
    </button>
  );
}
