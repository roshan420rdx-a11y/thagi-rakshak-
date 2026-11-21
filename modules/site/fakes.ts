// हमारे नाम से मिले नकली पेज/नंबर/ऐप (मिलने पर यहाँ जुड़ेंगे और /bharosa पर दिखेंगे)
export type FakeChannel = { kind: "page" | "number" | "app"; where: string; reportedAt: string };

export const FAKE_CHANNELS: readonly FakeChannel[] = [];
