import { ActionLink } from "@/components/ui/action-link";
import { Notice } from "@/components/ui/notice";
import { StepCard } from "@/components/ui/step-card";
import { TELE_MANAS, type TurantPage } from "@/modules/scams";

// एक /turant पन्ने के कदम: ऊपर चेतावनी (हो तो), फिर क्रम से कदम, फिर (ज़रूरत हो तो) Tele-MANAS।
// id="turant-steps" वाला हिस्सा ही "सुनें" बटन पढ़कर सुनाता है।
export function TurantSteps({ page }: { page: TurantPage }) {
  return (
    <div id="turant-steps" className="space-y-3">
      {page.banner ? <Notice tone={page.banner.tone}>{page.banner.textHi}</Notice> : null}
      <ol className="space-y-3">
        {page.steps.map((step, i) => (
          <StepCard key={step.id} n={i + 1} title={step.titleHi} urgency={step.urgencyHi}>
            <p>{step.bodyHi}</p>
            {step.warningHi ? <Notice tone="warn">{step.warningHi}</Notice> : null}
            {step.actions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {step.actions.map((a, j) => (
                  <ActionLink key={j} action={a} primary={j === 0 && a.kind === "tel"} />
                ))}
              </div>
            ) : null}
          </StepCard>
        ))}
      </ol>
      {page.showTeleManas ? (
        <Notice tone="info">
          मन बहुत भारी हो, तो किसी से बात करें। <ActionLink action={TELE_MANAS} />
        </Notice>
      ) : null}
    </div>
  );
}
