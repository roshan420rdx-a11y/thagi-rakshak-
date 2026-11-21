"use client";

import { useEffect, useState } from "react";

// internet न हो तो भरोसा दिलाने वाली पट्टी
export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;
  return (
    <p role="status" className="bg-warn-bg px-4 py-2 text-[15px] font-semibold text-warn">
      आप offline हैं। यह पन्ना फिर भी काम करेगा।
    </p>
  );
}
