import { expect, test } from "vitest";
import { parseFailedForm, parseFraudForm } from "@/modules/haq";

const TODAY = "2027-03-12";
const ok = { txn: "2027-03-10", loss: "40000", shared: "yes", how: "credentials_taken", r1930: "2027-03-10", rbank: "2027-03-11" };

test("ख़ाली params → empty", () => expect(parseFraudForm({}, TODAY)).toEqual({ ok: "empty" }));
test("सही form → input", () => {
  const r = parseFraudForm(ok, TODAY);
  expect(r.ok).toBe(true);
  if (r.ok === true) {
    expect(r.input).toMatchObject({ txnDate: "2027-03-10", grossLoss: 40000, recovered: 0, fault: "customer", customerType: "individual", instrument: "bank_account", accountKind: "unknown", reportedToBankOn: "2027-03-11", priorCompensation: false, crossBorder: false });
  }
});
test.each([
  ["yes", "customer"],
  ["no", "unknown"],
  ["bank", "bank"],
  ["app", "third_party"],
])("shared=%s → fault %s", (shared, fault) => {
  const r = parseFraudForm({ ...ok, shared }, TODAY);
  expect(r.ok === true && r.input.fault).toBe(fault);
});
const errs = (p: Record<string, string>) => {
  const r = parseFraudForm(p, TODAY);
  return r.ok === false ? r.errorsHi : [];
};
test("ग़लत तारीख़", () => expect(errs({ ...ok, txn: "2027-02-30" })).toContain("ठगी की तारीख़ सही नहीं है।"));
test("भविष्य की तारीख़", () => expect(errs({ ...ok, txn: "2027-03-13" })).toContain("ठगी की तारीख़ आज के बाद की नहीं हो सकती।"));
test("ग़लत रकम", () => {
  expect(errs({ ...ok, loss: "abc" })).toContain("कितने पैसे गए, सही रकम लिखें।");
  expect(errs({ ...ok, loss: "0" })).toContain("कितने पैसे गए, सही रकम लिखें।");
});
test("वापस मिली रकम ग़लत", () => expect(errs({ ...ok, back: "-5" })).toContain("वापस मिली रकम सही लिखें।"));
test("रिपोर्ट ठगी से पहले", () => expect(errs({ ...ok, rbank: "2027-03-01" })).toContain("रिपोर्ट की तारीख़ ठगी से पहले की नहीं हो सकती।"));
test("रिपोर्ट भविष्य में", () => expect(errs({ ...ok, r1930: "2027-03-20" })).toContain("रिपोर्ट की तारीख़ आज के बाद की नहीं हो सकती।"));
test("ख़ाली रिपोर्ट = अभी नहीं बताया", () => {
  const r = parseFraudForm({ ...ok, r1930: "", rbank: "" }, TODAY);
  expect(r.ok === true && [r.input.reportedTo1930On, r.input.reportedToBankOn]).toEqual([null, null]);
});
test("prior, abroad, who, inst, acct", () => {
  const r = parseFraudForm({ ...ok, prior: "yes", abroad: "on", who: "sole_proprietor", inst: "credit_card", acct: "bsbd", back: "1000" }, TODAY);
  expect(r.ok === true && r.input).toMatchObject({ priorCompensation: true, crossBorder: true, customerType: "sole_proprietor", instrument: "credit_card", accountKind: "bsbd", recovered: 1000 });
});
test("अनजान विकल्प default पर", () => {
  const r = parseFraudForm({ ...ok, how: "zzz", inst: "zzz" }, TODAY);
  expect(r.ok === true && [r.input.howHappened, r.input.instrument]).toEqual(["unknown", "bank_account"]);
});

test("failed: ख़ाली → empty; सही → input; ग़लत channel → ग़लती", () => {
  expect(parseFailedForm({}, TODAY)).toEqual({ ok: "empty" });
  expect(parseFailedForm({ ch: "upi_transfer", txn: "2027-03-01", res: "" }, TODAY)).toEqual({ ok: true, input: { channel: "upi_transfer", txnDate: "2027-03-01", resolvedOn: null } });
  const bad = parseFailedForm({ ch: "zzz", txn: "2027-03-01" }, TODAY);
  expect(bad.ok === false && bad.errorsHi).toContain("किस तरह का लेन-देन था, चुनें।");
  const early = parseFailedForm({ ch: "atm", txn: "2027-03-05", res: "2027-03-01" }, TODAY);
  expect(early.ok === false && early.errorsHi).toContain("पैसा लौटने की तारीख़ लेन-देन से पहले की नहीं हो सकती।");
});
