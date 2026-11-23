// "अक्षर बड़े करें" (अ+): बुज़ुर्गों और कम देखने वालों के लिए तीन स्तर। पसंद इसी फ़ोन में (localStorage) याद रहती है।
// <html data-akshar="2|3"> पर CSS (globals.css) पूरे पन्ने को बड़ा करती है। पन्ना दिखने से पहले लगने वाली छोटी script
// (TEXT_SIZE_PRESCRIPT) पुरानी पसंद तुरंत लगा देती है, ताकि छोटे अक्षर झलकें नहीं।
export type AksharLevel = "1" | "2" | "3";

export const AKSHAR_KEY = "thagi-rakshak:akshar:v1";
export const AKSHAR_LEVELS: readonly { id: AksharLevel; labelHi: string }[] = [
  { id: "1", labelHi: "सामान्य" },
  { id: "2", labelHi: "बड़े" },
  { id: "3", labelHi: "और बड़े" },
];

export function readAkshar(v: string | null | undefined): AksharLevel {
  return v === "2" || v === "3" ? v : "1";
}

export function nextAkshar(v: AksharLevel): AksharLevel {
  return v === "1" ? "2" : v === "2" ? "3" : "1";
}

export function aksharLabel(v: AksharLevel): string {
  return AKSHAR_LEVELS.find((l) => l.id === v)!.labelHi;
}

export const TEXT_SIZE_PRESCRIPT = `try{var a=localStorage.getItem(${JSON.stringify(AKSHAR_KEY)});if(a==="2"||a==="3")document.documentElement.dataset.akshar=a}catch(e){}`;
