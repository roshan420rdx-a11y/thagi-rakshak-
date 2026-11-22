import { SourceLine } from "@/components/haq/source-line";
import { parseFailedForm } from "@/modules/haq";
import { TAT_ROWS, evaluateFailedTxn, formatHindiDate } from "@/modules/rules-engine";
import type { TatChannel } from "@/modules/rules-engine";
import { FormErrors } from "./errors";
import { Field, INPUT_CLS } from "./field";

type Params = Record<string, string | string[] | undefined>;
const v = (p: Params, k: string) => {
  const x = p[k];
  return (Array.isArray(x) ? x[0] : x) ?? "";
};

// लेन-देन fail हुआ (ठगी नहीं): ₹100 रोज़ का हिसाब (RBI 2019 TAT)
export function FailedTxnView({ params, today }: { params: Params; today: string }) {
  const parsed = parseFailedForm(params, today);
  const res = parsed.ok === true ? evaluateFailedTxn(parsed.input, today) : null;

  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold leading-snug">लेन-देन fail हुआ, पैसा अटका: ₹100 रोज़</h1>
      <p>पैसा कट गया पर पहुँचा नहीं, तो बैंक को तय दिनों में लौटाना होता है। देर हुई, तो हर दिन ₹100 देना होता है, बिना माँगे।</p>
      {parsed.ok === false ? <FormErrors errorsHi={parsed.errorsHi} /> : null}
      {/* action में #nateeja: भेजने के बाद browser सीधे नतीजे पर जाए; बिना JS के भी */}
      <form method="get" action="/haq/failed-txn#nateeja" className="space-y-4 rounded-xl border border-line bg-paper p-3">
        <Field label="क्या हुआ?" htmlFor="ch">
          <select id="ch" name="ch" required defaultValue={v(params, "ch")} className={INPUT_CLS}>
            <option value="" disabled>
              चुनें
            </option>
            {(Object.entries(TAT_ROWS) as [TatChannel, (typeof TAT_ROWS)[TatChannel]][]).map(([key, row]) => (
              <option key={key} value={key}>
                {row.labelHi}
              </option>
            ))}
          </select>
        </Field>
        <Field label="लेन-देन किस तारीख़ को हुआ?" htmlFor="txn">
          <input id="txn" name="txn" type="date" max={today} required defaultValue={v(params, "txn")} className={INPUT_CLS} />
        </Field>
        <Field label="पैसा वापस किस तारीख़ को आया?" hint="अभी नहीं आया तो ख़ाली छोड़ें" htmlFor="res">
          <input id="res" name="res" type="date" max={today} defaultValue={v(params, "res")} className={INPUT_CLS} />
        </Field>
        <button type="submit" className="min-h-12 w-full rounded-[10px] bg-brand px-4 font-bold text-paper">
          हिसाब देखें
        </button>
      </form>
      {res ? (
        <section id="nateeja" className="space-y-2 rounded-xl border border-line bg-paper p-3">
          <h2 className="text-[19px] font-bold">आपका हिसाब</h2>
          <p>बैंक को {formatHindiDate(res.dueDate)} तक पैसा लौटाना था।</p>
          {res.compensation > 0 ? (
            <p className="rounded-lg bg-safe-bg p-2 text-center text-safe">
              <span className="block text-[14px]">{res.daysLate} दिन देर → मुआवज़ा बनता है</span>
              <span className="block text-[26px] font-bold">₹{res.compensation.toLocaleString("en-IN")}</span>
            </p>
          ) : (
            <p>अभी तय समय पूरा नहीं हुआ, या पैसा समय पर लौटा।</p>
          )}
          <p>
            यह मुआवज़ा बैंक को बिना माँगे, अपने आप देना होता है। न मिले, तो पहले बैंक से, फिर RBI Ombudsman (cms.rbi.org.in) पर शिकायत
            करें।
          </p>
          <SourceLine source={res.source} verifiedBy={["claude"]} />
        </section>
      ) : null}
    </div>
  );
}
