"use client";

import { ActionLink } from "@/components/ui/action-link";
import { BigDoor } from "@/components/ui/big-door";
import { IconAlert } from "@/components/ui/icons";

// चलते-चलते कोई गलती हो जाए: हिंदी में, बिना तकनीकी बात के, और इमरजेंसी रास्तों (1930, /turant) के साथ।
// अंदर की गलती (error.message) user को कभी नहीं दिखाई जाती।
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto max-w-[680px] space-y-4 px-4 py-8">
      <h1 className="text-[22px] font-bold">कुछ गड़बड़ हो गई</h1>
      <p>यह हमारी तरफ़ की गलती है, आपकी नहीं। एक बार फिर कोशिश करें।</p>
      <button
        type="button"
        onClick={reset}
        className="min-h-12 rounded-[10px] border border-line bg-paper px-6 font-bold text-brand"
      >
        फिर से कोशिश करें
      </button>
      <p className="font-semibold">ठगी हो गई है, तो रुकें नहीं:</p>
      <ActionLink action={{ kind: "tel", number: "1930", labelHi: "1930 मिलाएँ" }} primary />
      <BigDoor
        href="/turant"
        title="मेरे साथ ठगी हो गई"
        subtitle="अभी क्या करें, देखें"
        tone="danger"
        icon={<IconAlert className="h-8 w-8" />}
      />
      <p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- गलती के बाद पूरा पन्ना नए सिरे से खुले */}
        <a href="/" className="inline-flex min-h-12 items-center font-semibold text-brand">
          होम पर जाएँ
        </a>
      </p>
    </main>
  );
}
