// text में मना किए शब्द ढूँढना: बिना case के, NFC normalize करके (हिंदी के अक्षर अलग-अलग तरह से बने हो सकते हैं)
export function findForbidden(text: string, phrases: readonly string[]): { phrase: string; index: number }[] {
  const hay = text.normalize("NFC").toLowerCase();
  const hits: { phrase: string; index: number }[] = [];
  for (const phrase of phrases) {
    const needle = phrase.normalize("NFC").toLowerCase();
    if (!needle) continue;
    let from = 0;
    for (;;) {
      const index = hay.indexOf(needle, from);
      if (index === -1) break;
      hits.push({ phrase, index });
      from = index + needle.length;
    }
  }
  return hits.sort((a, b) => a.index - b.index);
}
