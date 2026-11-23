import { expect, test } from "vitest";
import { DONE_KEY, doneCount, isDone, parseDone, toggleDone } from "./done";

test("कदमों की याद: अपनी key, ख़राब/पुराना data हो तो ख़ाली", () => {
  expect(DONE_KEY).toBe("thagi-rakshak:turant-done:v1");
  expect(parseDone(null)).toEqual({});
  expect(parseDone("ख़राब")).toEqual({});
  expect(parseDone("[1,2]")).toEqual({});
  expect(parseDone(JSON.stringify({ upi: ["call_1930", 5, ""], card: "x" }))).toEqual({ upi: ["call_1930"] });
});

test("toggleDone: एक दबाव पर हो गया, दूसरे पर वापस; दूसरे प्रकार अलग; पुराना state नहीं बदलता", () => {
  const a = toggleDone({}, "upi", "call_1930");
  expect(isDone(a, "upi", "call_1930")).toBe(true);
  expect(isDone(a, "card", "call_1930")).toBe(false);
  const b = toggleDone(a, "upi", "call_1930");
  expect(isDone(b, "upi", "call_1930")).toBe(false);
  expect(isDone(a, "upi", "call_1930")).toBe(true);
  expect(b).toEqual({});
});

test("doneCount: सिर्फ़ इस पन्ने के आज वाले कदम गिने (पुराने/हटाए कदम नहीं)", () => {
  const s = { upi: ["call_1930", "bank_report", "purana_kadam"] };
  expect(doneCount(s, "upi", ["call_1930", "bank_report", "keep_evidence"])).toBe(2);
  expect(doneCount(s, "card", ["call_1930"])).toBe(0);
});

test("शिकायत वाले कदम (1930, बैंक, लिखित, पुलिस) हो जाएँ तो 'मेरा केस' में नंबर लिखने की बात; बाकी पर नहीं", async () => {
  const { needsCaseNote } = await import("./done");
  for (const id of ["call_1930", "tell_bank", "written_complaint", "police_report"]) expect(needsCaseNote(id), id).toBe(true);
  for (const id of ["keep_evidence", "block_card", "remove_app"]) expect(needsCaseNote(id), id).toBe(false);
});
