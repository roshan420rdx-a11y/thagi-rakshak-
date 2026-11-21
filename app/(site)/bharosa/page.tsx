import Link from "next/link";
import type { Metadata } from "next";
import { FAKE_CHANNELS, NEVER_LIST, getSiteConfig } from "@/modules/site";

export const metadata: Metadata = { title: "हम पर भरोसा क्यों करें — ठगी रक्षक" };

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

function formatWhatsApp(n: string): string {
  // 919876543210 → +91 98765 43210
  return `+91 ${n.slice(2, 7)} ${n.slice(7)}`;
}

export default function BharosaPage() {
  const { whatsappNumber, siteUrl } = getSiteConfig();
  return (
    <div className="space-y-5">
      <h1 className="text-[22px] font-bold leading-snug">हम पर भरोसा क्यों करें</h1>

      <section className="space-y-2">
        <h2 className="text-[19px] font-bold">हम ये काम कभी नहीं करेंगे</h2>
        <ul className="space-y-2">
          {NEVER_LIST.map((line) => (
            <li key={line} className="flex gap-2">
              <span aria-hidden="true" className="shrink-0 font-bold text-danger">
                ✕
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2 rounded-xl border-2 border-danger bg-danger-bg p-3 text-danger">
        <h2 className="text-[19px] font-bold">कोई &quot;ठगी रक्षक&quot; बनकर call करे तो?</h2>
        <p className="font-semibold">वह ठग है। हम कभी पहले call नहीं करते। call काटें और 1930 पर बताएँ।</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-[19px] font-bold">हमारे असली रास्ते</h2>
        <dl className="space-y-1 rounded-xl border border-line bg-paper p-3">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">वेबसाइट</dt>
            <dd className="font-semibold">{hostOf(siteUrl)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">WhatsApp</dt>
            <dd className="font-semibold">{whatsappNumber ? formatWhatsApp(whatsappNumber) : "जल्द शुरू होगा"}</dd>
          </div>
        </dl>
        <p>इनके अलावा हमारे नाम से कोई भी नंबर, पेज या ऐप नकली है।</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-[19px] font-bold">आपकी जानकारी कहाँ जाती है</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>साइट पर हम आपका नाम, फ़ोन नंबर या खाता नंबर नहीं माँगते।</li>
          <li>
            “पहले पूछो” में चिपकाया message आपके फ़ोन में ही जाँचा जाता है। वह हमारे पास नहीं आता, और कहीं सेव नहीं होता।
          </li>
          <li>साइट पर कोई cookie, विज्ञापन या tracker नहीं।</li>
        </ul>
        <Link href="/legal/privacy" className="flex min-h-12 items-center font-semibold text-brand">
          पूरी बात: निजता पन्ना →
        </Link>
      </section>

      <section className="space-y-2">
        <h2 className="text-[19px] font-bold">हम कौन हैं</h2>
        <p>
          ठगी रक्षक एक स्वतंत्र सेवा है। हम सरकार, पुलिस या किसी बैंक का हिस्सा नहीं हैं। हम आपको सही सरकारी और बैंक के
          रास्तों तक पहुँचाने में मदद करते हैं।
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-[19px] font-bold">हम पैसे कैसे कमाएँगे?</h2>
        <p>
          अभी सब कुछ मुफ़्त है। आगे अर्ज़ियों की किट के पैसे लग सकते हैं, पर ज़रूरी मदद (पहले 60 मिनट, बैंक को शिकायत, हक़
          का हिसाब) हमेशा मुफ़्त रहेगी। जिनके पास पैसे न हों, उनके लिए किट भी मुफ़्त होगी।
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-[19px] font-bold">हमारे नाम से नकली पेज</h2>
        {FAKE_CHANNELS.length === 0 ? (
          <p>अभी तक कोई नकली पेज नहीं मिला। मिलने पर यहीं बताएँगे।</p>
        ) : (
          <ul className="space-y-1">
            {FAKE_CHANNELS.map((f) => (
              <li key={`${f.kind}-${f.where}`}>
                {f.where} ({f.reportedAt})
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
