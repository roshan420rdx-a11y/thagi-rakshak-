import type { Metadata } from "next";
import { pageMeta } from "@/modules/site/meta";
import { Notice } from "@/components/ui/notice";
import { StepCard } from "@/components/ui/step-card";

export const metadata: Metadata = pageMeta({
  title: "ठग के खाते में पैसा रुका: वापस कैसे माँगें",
  description:
    "पुलिस ने ठग के खाते में आपका पैसा रोक (freeze) दिया? छोटी रकम के लिए online अर्ज़ी, बड़ी के लिए FIR और कोर्ट: कदम-दर-कदम।",
  path: "/haq/frozen-money",
});

export default function FrozenMoneyPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-[22px] font-bold leading-snug">ठग के खाते में पैसा रुका (freeze): वापस कैसे माँगें</h1>
      <Notice tone="warn">यह गाइड समाचारों और सरकारी घोषणाओं पर आधारित है; मूल SOP (गृह मंत्रालय) से जाँच अभी बाकी है।</Notice>
      <ol className="space-y-3">
        <StepCard n={1} title="शिकायत का नंबर सँभालें">
          <p>1930 या cybercrime.gov.in पर शिकायत करने पर 14 अंकों वाला शिकायत नंबर (NCRP) मिलता है। इसी से आगे की हर अर्ज़ी होती है।</p>
        </StepCard>
        <StepCard n={2} title="पैसा रुका है, यह पक्का करें">
          <p>वापसी की अर्ज़ी तभी बनती है, जब पुलिस या बैंक बताए कि ठग के खाते में आपका पैसा रोका (freeze) गया है।</p>
        </StepCard>
        <StepCard n={3} title="छोटी रकम: online अर्ज़ी">
          <p>
            समाचारों के अनुसार ₹50,000 तक की रुकी रकम के लिए गृह मंत्रालय के Money Restoration Module पर online अर्ज़ी होती है, शिकायत
            नंबर और उसी मोबाइल नंबर के साथ जिससे शिकायत की थी।
          </p>
        </StepCard>
        <StepCard n={4} title="बड़ी रकम: FIR और कोर्ट">
          <p>बड़ी रकम के लिए FIR और मजिस्ट्रेट (कोर्ट) का आदेश लेना होता है। इसके लिए किसी वकील की मदद लें।</p>
        </StepCard>
        <StepCard n={5} title='"पैसा वापस दिलाने" वालों से सावधान'>
          <p>कोई पैसा वापस करवाने के बदले पहले पैसे माँगे, तो वह भी ठग है। सरकारी रास्ते पर कोई फ़ीस नहीं लगती।</p>
        </StepCard>
      </ol>
    </div>
  );
}
