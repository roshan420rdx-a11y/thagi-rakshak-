import { BigDoor } from "@/components/ui/big-door";
import { IconAlert, IconSearch } from "@/components/ui/icons";
import { TrustBar } from "@/components/ui/trust-bar";
import { getSiteConfig, whatsappLink } from "@/modules/site";

export default function HomePage() {
  const { whatsappNumber } = getSiteConfig();
  return (
    <div className="space-y-4">
      <h1 className="sr-only">ठगी रक्षक: डिजिटल ठगी में मदद</h1>
      <BigDoor
        href="/turant"
        title="मेरे साथ ठगी हो गई"
        subtitle="अभी मदद पाएँ · मुफ़्त · बिना login"
        tone="danger"
        icon={<IconAlert className="h-8 w-8" />}
      />
      <BigDoor
        href="/pucho"
        title="यह call या message ठगी है?"
        subtitle="ठगी के 7 आम निशान · मुफ़्त"
        tone="safe"
        icon={<IconSearch className="h-8 w-8" />}
      />
      <TrustBar />
      {whatsappNumber ? (
        <a
          href={whatsappLink(whatsappNumber, "नमस्ते, मुझे ठगी से जुड़ी मदद चाहिए")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center rounded-xl bg-safe px-4 font-bold text-on-safe no-underline"
        >
          WhatsApp पर बात करें
        </a>
      ) : null}
    </div>
  );
}
