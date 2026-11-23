import Link from "next/link";
import { Notice } from "@/components/ui/notice";
import { parseFraudForm } from "@/modules/haq";
import { evaluateRights } from "@/modules/rules-engine";
import { CaseFill } from "./case-fill";
import { FormErrors } from "./errors";
import { Field, INPUT_CLS, Radios } from "./field";
import { RightsResultCard } from "./rights-result";

type Params = Record<string, string | string[] | undefined>;
const v = (p: Params, k: string) => {
  const x = p[k];
  return (Array.isArray(x) ? x[0] : x) ?? "";
};

const HOW = [
  ["credentials_taken", "किसी ने OTP, PIN या password ले लिया"],
  ["coerced", "डराकर या धमकाकर पैसे भिजवाए (जैसे digital arrest)"],
  ["self_sent_deceived", "लालच या धोखे में मैंने ख़ुद भेजे (निवेश, task, नौकरी)"],
  ["unauthorised", "बिना मेरी किसी मंज़ूरी के कट गए"],
  ["unknown", "पता नहीं"],
] as const;

// ठगी में पैसा गया: आपका हक़ (form + नतीजा)। बिना JS के: GET form, नतीजा server पर।
export function ThagiView({ params, today }: { params: Params; today: string }) {
  const parsed = parseFraudForm(params, today);
  const results = parsed.ok === true ? evaluateRights(parsed.input, today) : [];
  const notReported = parsed.ok === true && (!parsed.input.reportedTo1930On || !parsed.input.reportedToBankOn);

  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold leading-snug">ठगी में पैसा गया: आपका हक़</h1>
      <p>RBI के नियमों से हिसाब: पूरा पैसा वापस (ज़ीरो ज़िम्मेदारी), या ₹25,000 तक का मुआवज़ा, और बैंक को कब तक जवाब देना है।</p>

      {parsed.ok === false ? <FormErrors errorsHi={parsed.errorsHi} /> : null}
      {parsed.ok === "empty" ? <CaseFill /> : null}

      {/* action में #nateeja: भेजने के बाद browser सीधे नतीजे पर जाए (फ़ोन पर वह लंबे form के नीचे है); बिना JS के भी */}
      <form method="get" action="/haq/thagi#nateeja" className="space-y-4 rounded-xl border border-line bg-paper p-3">
        <Field label="ठगी किस तारीख़ को हुई?" htmlFor="txn">
          <input id="txn" name="txn" type="date" max={today} required defaultValue={v(params, "txn")} className={INPUT_CLS} />
        </Field>
        <Field label="कुल कितने पैसे गए? (₹)" htmlFor="loss">
          <input id="loss" name="loss" type="text" inputMode="decimal" autoComplete="off" required defaultValue={v(params, "loss")} className={INPUT_CLS} />
        </Field>
        <Field label="अब तक कितने वापस मिले? (₹)" hint="कुछ नहीं मिला तो 0 रहने दें" htmlFor="back">
          <input id="back" name="back" type="text" inputMode="decimal" autoComplete="off" defaultValue={v(params, "back") || "0"} className={INPUT_CLS} />
        </Field>
        <Field label="पैसे कहाँ से गए?">
          <Radios
            name="inst"
            value={v(params, "inst") || "bank_account"}
            options={[
              ["bank_account", "बैंक खाते से (UPI, net banking, debit card)"],
              ["credit_card", "credit card से"],
              ["wallet", "wallet से (जो बैंक नहीं है)"],
            ]}
          />
        </Field>
        <Field label="ठगी कैसे हुई?" htmlFor="how">
          <select id="how" name="how" defaultValue={v(params, "how") || "unknown"} className={INPUT_CLS}>
            {HOW.map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="क्या आपने OTP, PIN या password किसी को बताया, या उनके कहने पर कोई ऐप डाला?">
          <Radios
            name="shared"
            value={v(params, "shared") || "no"}
            options={[
              ["yes", "हाँ"],
              ["no", "नहीं, फिर भी पैसे कटे"],
              ["app", "नहीं, किसी ऐप या कंपनी की गड़बड़ लगती है"],
              ["bank", "नहीं, बैंक की गड़बड़ लगती है"],
            ]}
          />
        </Field>
        <Field label="1930 या cybercrime.gov.in पर कब बताया?" hint="अभी नहीं बताया तो ख़ाली छोड़ें" htmlFor="r1930">
          <input id="r1930" name="r1930" type="date" max={today} defaultValue={v(params, "r1930")} className={INPUT_CLS} />
        </Field>
        <Field label="बैंक को कब बताया?" hint="अभी नहीं बताया तो ख़ाली छोड़ें" htmlFor="rbank">
          <input id="rbank" name="rbank" type="date" max={today} defaultValue={v(params, "rbank")} className={INPUT_CLS} />
        </Field>
        <Field label="खाता किसका है?" htmlFor="who">
          <select id="who" name="who" defaultValue={v(params, "who") || "individual"} className={INPUT_CLS}>
            <option value="individual">मेरा अपना (व्यक्ति)</option>
            <option value="sole_proprietor">मेरी अकेले की दुकान या धंधा (sole proprietor)</option>
            <option value="other">कंपनी या साझेदारी</option>
          </select>
        </Field>
        <Field label="खाते का प्रकार" hint="2027 से पहले की ठगी में ज़रूरी" htmlFor="acct">
          <select id="acct" name="acct" defaultValue={v(params, "acct") || "unknown"} className={INPUT_CLS}>
            <option value="unknown">पता नहीं</option>
            <option value="bsbd">ज़ीरो बैलेंस वाला बचत खाता (BSBD / जन धन)</option>
            <option value="savings">आम बचत खाता</option>
            <option value="small_current_or_card">छोटा चालू खाता, या ₹5 लाख तक का credit card</option>
            <option value="other_current_or_big_card">बड़ा चालू खाता, या ₹5 लाख से ज़्यादा का credit card</option>
          </select>
        </Field>
        <Field label="क्या यह मुआवज़ा आपने पहले कभी लिया है?">
          <Radios name="prior" value={v(params, "prior") || "no"} options={[["no", "नहीं"], ["yes", "हाँ"]]} />
        </Field>
        <label className="flex min-h-12 items-center gap-3">
          <input type="checkbox" name="abroad" defaultChecked={v(params, "abroad") === "on"} className="h-5 w-5" />
          <span>पैसा विदेश के खाते या कंपनी में गया</span>
        </label>
        <button type="submit" className="min-h-12 w-full rounded-[10px] bg-brand px-4 font-bold text-paper">
          हिसाब देखें
        </button>
      </form>

      {parsed.ok === true ? (
        <section id="nateeja" className="space-y-3">
          <h2 className="text-[19px] font-bold">आपका हिसाब</h2>
          {notReported ? (
            <Link href="/turant" className="flex min-h-12 items-center rounded-xl bg-danger px-4 font-bold text-on-danger no-underline">
              अभी तक 1930 और बैंक को नहीं बताया? पहले यह करें →
            </Link>
          ) : null}
          {results.length === 0 ? <p>इस हाल पर कोई नियम सीधे लागू नहीं हुआ। फिर भी 1930 और बैंक को ज़रूर बताएँ।</p> : null}
          {results.map((r) => (
            <RightsResultCard key={r.ruleId} result={r} />
          ))}
          <Notice tone="info">यह हिसाब RBI के नियमों पर है, कानूनी सलाह नहीं। आख़िरी फ़ैसला बैंक की जाँच से होगा।</Notice>
        </section>
      ) : null}
    </div>
  );
}
