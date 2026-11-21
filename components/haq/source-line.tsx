import type { Source } from "@/modules/rules-engine";

// "यह नियम कहाँ लिखा है": RBI paragraph + मूल text का link + जाँच की स्थिति
export function SourceLine({ source, verifiedBy }: { source: Source; verifiedBy: string[] }) {
  return (
    <p className="text-[13px] text-muted">
      RBI: para {source.paragraph} ·{" "}
      <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand">
        मूल text
      </a>
      {verifiedBy.includes("owner") ? null : <> · RBI के मूल text से मिलाया गया · दूसरी जाँच बाकी</>}
    </p>
  );
}
