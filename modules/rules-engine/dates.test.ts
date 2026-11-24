import { expect, test } from "vitest";
import { addDays, daysBetween, formatHindiDate, formatEnglishDate, formatEnglishTime, formatHindiTime, isValidIsoDate, isValidTime, nowTimeInKolkata, todayInKolkata, workingDaysBetween } from "./dates";

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

test("समय: सिर्फ़ HH:MM (24 घंटे) वाला सही समय", () => {
  for (const ok of ["00:00", "09:05", "16:30", "23:59"]) expect(isValidTime(ok)).toBe(true);
  for (const bad of ["24:00", "9:05", "16:3", "12:60", "", "4 बजे", "16:30:00"]) expect(isValidTime(bad)).toBe(false);
});

test("समय हिंदी में: पहर + 12 घंटे वाला, और 24 घंटे वाला कोष्ठक में (कोई गलतफ़हमी नहीं)", () => {
  expect(formatHindiTime("00:05")).toBe("रात 12:05 बजे (00:05)");
  expect(formatHindiTime("03:59")).toBe("रात 3:59 बजे (03:59)");
  expect(formatHindiTime("04:00")).toBe("सुबह 4:00 बजे (04:00)");
  expect(formatHindiTime("11:59")).toBe("सुबह 11:59 बजे (11:59)");
  expect(formatHindiTime("12:00")).toBe("दोपहर 12:00 बजे (12:00)");
  expect(formatHindiTime("15:45")).toBe("दोपहर 3:45 बजे (15:45)");
  expect(formatHindiTime("16:30")).toBe("शाम 4:30 बजे (16:30)");
  expect(formatHindiTime("19:59")).toBe("शाम 7:59 बजे (19:59)");
  expect(formatHindiTime("20:00")).toBe("रात 8:00 बजे (20:00)");
  expect(formatHindiTime("23:10")).toBe("रात 11:10 बजे (23:10)");
});

test("अभी का समय भारत (Asia/Kolkata) के हिसाब से", () => {
  expect(nowTimeInKolkata(new Date("2026-11-24T10:00:00Z"))).toBe("15:30");
  expect(nowTimeInKolkata(new Date("2026-11-24T18:45:00Z"))).toBe("00:15");
});

test("English तारीख़ और समय (English वाले पत्र के लिए)", () => {
  expect(formatEnglishDate("2027-01-12")).toBe("12 January 2027");
  expect(formatEnglishDate("2026-09-05")).toBe("5 September 2026");
  expect(formatEnglishTime("00:05")).toBe("12:05 AM (00:05)");
  expect(formatEnglishTime("09:30")).toBe("9:30 AM (09:30)");
  expect(formatEnglishTime("12:00")).toBe("12:00 PM (12:00)");
  expect(formatEnglishTime("16:30")).toBe("4:30 PM (16:30)");
  expect(formatEnglishTime("23:59")).toBe("11:59 PM (23:59)");
});
