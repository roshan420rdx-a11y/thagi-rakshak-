import { BigDoor } from "@/components/ui/big-door";
import { IconAlert } from "@/components/ui/icons";
import { TrustBar } from "@/components/ui/trust-bar";

// अस्थायी होम: TR-5 में दो दरवाज़ों वाला पूरा होम बनेगा
export default function Home() {
  return (
    <main className="mx-auto max-w-[680px] space-y-4 px-4 py-6">
      <h1 className="text-[22px] font-bold text-brand">ठगी रक्षक</h1>
      <BigDoor
        href="/turant"
        title="मेरे साथ ठगी हो गई"
        subtitle="अभी मदद पाएँ · मुफ़्त · बिना login"
        tone="danger"
        icon={<IconAlert className="h-8 w-8" />}
      />
      <TrustBar />
    </main>
  );
}
