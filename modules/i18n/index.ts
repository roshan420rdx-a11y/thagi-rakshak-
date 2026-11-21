import glossary from "./glossary.json";

export { parseLocale } from "./locale";
export type { Locale } from "./locale";
export { translate } from "./translate";
export type { Vars } from "./translate";
export { FORBIDDEN_PHRASES } from "./forbidden";
export { findForbidden } from "./copy-lint";

// पूरे product में एक जैसे शब्द (spec भाग 2, खंड 4.2)
export const GLOSSARY: ReadonlyArray<{ term: string; hi: string }> = glossary;
