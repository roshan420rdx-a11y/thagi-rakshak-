// keyboard या screen reader से चलाने वालों के लिए: पहली Tab पर यही link, menu छोड़कर सीधे पन्ने की बात पर
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-[10px] bg-brand px-4 py-3 font-bold text-paper focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50"
    >
      मुख्य हिस्से पर जाएँ
    </a>
  );
}
