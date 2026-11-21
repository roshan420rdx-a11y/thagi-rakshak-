import { expect, test } from "vitest";
import { pickHindiVoice } from "./listen-voice";

const v = (lang: string, name = lang, localService = true) => ({ lang, name, localService }) as SpeechSynthesisVoice;

test("Hindi आवाज़ न हो तो null (बटन नहीं दिखेगा)", () => {
  expect(pickHindiVoice([])).toBeNull();
  expect(pickHindiVoice([v("en-US"), v("en-IN")])).toBeNull();
});

test("hi-IN आवाज़ चुनी जाए; फ़ोन के अंदर वाली (localService) पहले", () => {
  expect(pickHindiVoice([v("en-IN"), v("hi-IN", "remote", false), v("hi-IN", "local", true)])?.name).toBe("local");
  expect(pickHindiVoice([v("hi_IN", "underscore")])?.name).toBe("underscore");
  expect(pickHindiVoice([v("hi", "plain")])?.name).toBe("plain");
});
