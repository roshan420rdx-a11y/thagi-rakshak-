import { expect, test } from "vitest";
import { addDays, daysBetween, formatHindiDate, isValidIsoDate, todayInKolkata, workingDaysBetween } from "./dates";

test("isValidIsoDate", () => {
  expect(isValidIsoDate("2027-02-28")).toBe(true);
  expect(isValidIsoDate("2028-02-29")).toBe(true);
  expect(isValidIsoDate("2027-02-29")).toBe(false);
  expect(isValidIsoDate("2027-02-30")).toBe(false);
  expect(isValidIsoDate("27-2-1")).toBe(false);
  expect(isValidIsoDate("")).toBe(false);
});
test("addDays महीना पार", () => expect(addDays("2027-01-30", 5)).toBe("2027-02-04"));
test("daysBetween", () => {
  expect(daysBetween("2027-01-01", "2027-01-06")).toBe(5);
  expect(daysBetween("2027-01-06", "2027-01-01")).toBe(-5);
});
test("workingDays: रविवार और दूसरा शनिवार नहीं गिने", () =>
  // 2027-01-08 (शुक्र) → 2027-01-11 (सोम): 9 जनवरी दूसरा शनिवार, 10 रविवार → सिर्फ़ 11 = 1
  expect(workingDaysBetween("2027-01-08", "2027-01-11")).toBe(1));
test("workingDays: पहला शनिवार गिना जाता है", () =>
  // 2027-01-01 (शुक्र) → 2027-01-04 (सोम): 2 जनवरी पहला शनिवार (गिना), 3 रविवार → 2 और 4 = 2
  expect(workingDaysBetween("2027-01-01", "2027-01-04")).toBe(2));
test("workingDays: चौथा शनिवार नहीं गिना", () =>
  // 2027-01-22 (शुक्र) → 2027-01-25 (सोम): 23 चौथा शनिवार, 24 रविवार → 1
  expect(workingDaysBetween("2027-01-22", "2027-01-25")).toBe(1));
test("workingDays: उसी दिन → 0", () => expect(workingDaysBetween("2027-01-05", "2027-01-05")).toBe(0));
test("हिंदी तारीख़", () => {
  expect(formatHindiDate("2027-01-12")).toBe("12 जनवरी 2027");
  expect(formatHindiDate("2027-09-05")).toBe("5 सितंबर 2027");
});
test("Kolkata की आज की तारीख़ (UTC 20:00 = अगले दिन IST)", () =>
  expect(todayInKolkata(new Date("2027-01-12T20:00:00Z"))).toBe("2027-01-13"));
