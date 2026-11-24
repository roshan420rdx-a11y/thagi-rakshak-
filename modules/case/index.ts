export {
  CASE_KEY,
  MAX_NUMBER_CHARS,
  STAGE_IDS,
  caseDeadlines,
  caseHasData,
  cleanNumber,
  emptyCase,
  haqFieldsFromCase,
  nextStage,
  noteWhen,
  parseCase,
  serializeCase,
} from "./local";
export type { CaseStage, HaqFields, LocalCase } from "./local";
export { caseIcs, caseSummaryText } from "./export";
