import type { FraudInput } from "./types";

// tests के लिए एक सामान्य मामला: 10 मार्च 2027, ₹40,000, OTP दिया (ग्राहक की लापरवाही), उसी दिन 1930 और बैंक को बताया
export const BASE_2027: FraudInput = {
  txnDate: "2027-03-10",
  grossLoss: 40000,
  recovered: 0,
  customerType: "individual",
  howHappened: "credentials_taken",
  fault: "customer",
  instrument: "bank_account",
  accountKind: "savings",
  reportedTo1930On: "2027-03-10",
  reportedToBankOn: "2027-03-10",
  priorCompensation: false,
  crossBorder: false,
};
