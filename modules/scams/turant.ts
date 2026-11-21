// /turant (इमरजेंसी) पन्नों का content। Task 5 में पूरा data यहाँ जुड़ता है।

export type TurantAction =
  | { kind: "tel"; number: string; labelHi: string }
  | { kind: "link"; href: string; labelHi: string; external: boolean };
