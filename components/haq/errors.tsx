import { Notice } from "@/components/ui/notice";

export function FormErrors({ errorsHi }: { errorsHi: string[] }) {
  return (
    <Notice tone="danger">
      कृपया ठीक करें:
      <span className="mt-1 block">
        {errorsHi.map((e) => (
          <span key={e} className="block">
            • {e}
          </span>
        ))}
      </span>
    </Notice>
  );
}
