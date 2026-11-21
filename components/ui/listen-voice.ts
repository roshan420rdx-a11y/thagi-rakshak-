// Hindi आवाज़ चुनना। न मिले तो null: तब "सुनें" बटन नहीं दिखता (वरना हिंदी text अंग्रेज़ी आवाज़ में अजीब पढ़ा जाता है)।
// फ़ोन के अंदर वाली आवाज़ (localService) पहले, ताकि text कम से कम बाहर जाए।
export function pickHindiVoice(voices: readonly SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const hindi = voices.filter((v) => /^hi([-_]|$)/i.test(v.lang));
  return hindi.find((v) => v.localService) ?? hindi[0] ?? null;
}
