"use client";

import { useEffect } from "react";

// service worker (/sw.js) सिर्फ़ production में, ताकि /turant offline भी खुले
export function SwRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // register न हो पाए तो भी पन्ना सामान्य रूप से चलता रहे
    });
  }, []);
  return null;
}
