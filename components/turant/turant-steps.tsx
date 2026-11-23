import type { ReactNode } from "react";
import { ActionLink } from "@/components/ui/action-link";
import { Notice } from "@/components/ui/notice";
import { StepCard } from "@/components/ui/step-card";
import { TELE_MANAS, type TurantPage } from "@/modules/scams";
import { StepDoneButton, StepsDoneProvider, StepsProgress } from "./steps-done";

// एक /turant पन्ने के कदम: सबसे ऊपर चेतावनी (हो तो; digital arrest में पीड़ित शायद अभी call पर है), फिर `slot`
// ("यह कब हुआ?"), फिर क्रम से कदम, फिर (ज़रूरत हो तो) Tele-MANAS।
// "सुनें" बटन सिर्फ़ id="turant-banner" और id="turant-steps" वाले हिस्से पढ़ता है, slot नहीं।
export function TurantSteps({ page, headingLevel = 2, slot }: { page: TurantPage; headingLevel?: 2 | 3; slot?: ReactNode }) {
  return (
    <div className="space-y-3">
      {page.banner ? (
        <div id="turant-banner">
          <Notice tone={page.banner.tone}>{page.banner.textHi}</Notice>
        </div>
      ) : null}
      {slot}
      <div id="turant-steps" className="space-y-3">
        <StepsDoneProvider slug={page.slug} stepIds={page.steps.map((s) => s.id)}>
          <StepsProgress />
          <ol className="space-y-3">
            {page.steps.map((step, i) => (
              <StepCard key={step.id} n={i + 1} title={step.titleHi} urgency={step.urgencyHi} headingLevel={headingLevel}>
                <p>{step.bodyHi}</p>
                {step.warningHi ? <Notice tone="warn">{step.warningHi}</Notice> : null}
                {step.actions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {step.actions.map((a, j) => (
                      <ActionLink key={j} action={a} primary={j === 0 && a.kind === "tel"} />
                    ))}
                  </div>
                ) : null}
                <StepDoneButton stepId={step.id} n={i + 1} />
              </StepCard>
            ))}
          </ol>
        </StepsDoneProvider>
        {page.showTeleManas ? (
          <Notice tone="info">
            मन बहुत भारी हो, तो किसी से बात करें। <ActionLink action={TELE_MANAS} />
          </Notice>
        ) : null}
      </div>
    </div>
  );
}
