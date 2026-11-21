import { Notice } from "@/components/ui/notice";
import { LEGAL_VERSION } from "@/modules/site";

export function DraftBanner() {
  return (
    <Notice tone="warn">
      यह मसौदा है: वकील की जाँच अभी बाकी है। संस्करण: {LEGAL_VERSION}
    </Notice>
  );
}
