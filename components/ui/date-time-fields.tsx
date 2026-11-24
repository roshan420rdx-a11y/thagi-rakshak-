"use client";

import { addDays } from "@/modules/rules-engine";

// तारीख़ और समय भरने के खाने ("मेरा केस" और "अर्ज़ियाँ" दोनों में एक जैसे)। फ़ोन का अपना calendar/घड़ी वाला picker,
// और साथ में एक tap वाले बटन, ताकि घबराहट में calendar खोलना ही न पड़े। सब फ़ोन में, कोई network नहीं।
const PICKER = "min-h-12 min-w-[150px] flex-1 rounded-[10px] border border-line bg-paper px-3 text-[18px] text-ink";
const QUICK = "min-h-12 shrink-0 rounded-[10px] border border-line bg-paper px-3 font-semibold text-brand";

// तारीख़ + "आज" / "कल" (plan A2d, A2h): ज़्यादातर लोग उसी दिन या अगले दिन भरते हैं। आगे की तारीख़ नहीं चुनी जा सकती।
export function DateField(props: {
  id: string;
  label: string;
  name: string; // बटनों के पूरे नाम के लिए, जैसे "ठगी की तारीख़" → "ठगी की तारीख़: आज"
  value: string | null;
  today: string;
  onChange: (v: string | null) => void;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={props.id} className="block font-semibold">
        {props.label}
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          id={props.id}
          type="date"
          max={props.today}
          value={props.value ?? ""}
          onChange={(e) => props.onChange(e.target.value || null)}
          className={PICKER}
        />
        {/* दोनों बटन साथ रहें: जगह कम हो तो दोनों एक साथ नीचे जाएँ */}
        <div className="flex gap-2">
          <button type="button" aria-label={`${props.name}: आज`} onClick={() => props.onChange(props.today)} className={QUICK}>
            आज
          </button>
          <button type="button" aria-label={`${props.name}: कल`} onClick={() => props.onChange(addDays(props.today, -1))} className={QUICK}>
            कल
          </button>
        </div>
      </div>
    </div>
  );
}

// लगभग समय + "अभी" (plan A2h): थाना, बैंक और cybercrime.gov.in ठगी का समय भी पूछते हैं। ख़ाली छोड़ा जा सकता है।
export function TimeField(props: {
  id: string;
  label: string;
  name: string; // जैसे "ठगी का समय" → "ठगी का समय: अभी"
  value: string | null;
  onChange: (v: string | null) => void;
  onNow: () => void;
}) {
  const hint = `${props.id}-hint`;
  return (
    <div className="space-y-1">
      <label htmlFor={props.id} className="block font-semibold">
        {props.label}
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          id={props.id}
          type="time"
          aria-describedby={hint}
          value={props.value ?? ""}
          onChange={(e) => props.onChange(e.target.value || null)}
          className={PICKER}
        />
        <button type="button" aria-label={`${props.name}: अभी`} onClick={props.onNow} className={QUICK}>
          अभी
        </button>
      </div>
      <p id={hint} className="text-[14px] text-muted">
        ठीक-ठीक याद न हो, तो अंदाज़े से भरें (पत्र में &quot;लगभग&quot; लिखा जाएगा), या ख़ाली छोड़ें।
      </p>
    </div>
  );
}
