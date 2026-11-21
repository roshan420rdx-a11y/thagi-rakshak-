import { BigDoor } from "@/components/ui/big-door";
import { IconAlert } from "@/components/ui/icons";
import { TrustBar } from "@/components/ui/trust-bar";

// अस्थायी होम: Task 3 में दो दरवाज़ों वाला पूरा होम बनेगा
export default function Home() {
  return (
    <div className="space-y-4">
      <BigDoor
        href="/turant"
        title="मेरे साथ ठगी हो गई"
        subtitle="अभी मदद पाएँ · मुफ़्त · बिना login"
        tone="danger"
        icon={<IconAlert className="h-8 w-8" />}
      />
      <TrustBar />
    </div>
  );
}
