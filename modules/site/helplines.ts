// ज़रूरी नंबर (/nambar): हर नंबर एक tap में। हर नंबर का मूल स्रोत saved file में है, और test उद्धरण मिलाता है
// (docs/sources/gov/, docs/sources/rbi/)। जो नंबर अभी किसी मूल पन्ने से नहीं मिलाया जा सका, उस पर यह साफ़ लिखा रहता है।
type Source = { file: string; url: string; quote: string };

export type Helpline = {
  number: string;
  titleHi: string;
  whenHi: string;
  source: Source | null;
  unverifiedHi?: string;
};

const SANCHAR_SAATHI = { file: "docs/sources/gov/2026-11-23-sanchar-saathi.txt", url: "https://sancharsaathi.gov.in/" };
const SS_HELPLINES = "National police helpline number is 112. National women helpline number is 181 and Cyber Crime Helpline is 1930.";

export const HELPLINES: readonly Helpline[] = [
  {
    number: "1930",
    titleHi: "साइबर ठगी हेल्पलाइन",
    whenHi: "ठगी में पैसे गए हों, तो सबसे पहले यही। जितनी जल्दी, पैसा रुकने का उतना ज़्यादा मौका।",
    source: { ...SANCHAR_SAATHI, quote: SS_HELPLINES },
  },
  {
    number: "112",
    titleHi: "पुलिस / आपातकाल",
    whenHi: "जान का ख़तरा हो, कोई घर आकर धमकाए, या तुरंत पुलिस चाहिए।",
    source: { ...SANCHAR_SAATHI, quote: SS_HELPLINES },
  },
  {
    number: "181",
    titleHi: "महिला हेल्पलाइन",
    whenHi: "किसी महिला को धमकी, blackmail या परेशान किया जा रहा हो।",
    source: { ...SANCHAR_SAATHI, quote: SS_HELPLINES },
  },
  {
    number: "14416",
    titleHi: "Tele-MANAS: मन की बात (मुफ़्त)",
    whenHi: "डर, शर्म या बहुत परेशानी हो, और किसी से बात करनी हो।",
    source: null,
    unverifiedHi: "Tele-MANAS की अपनी साइट इस environment से नहीं खुली (2026-11-23); मिलान बाकी।",
  },
  {
    number: "14448",
    titleHi: "RBI शिकायत हेल्पलाइन",
    whenHi: "बैंक ने ठगी की शिकायत का जवाब न दिया हो, या RBI वाली शिकायत की हालत पूछनी हो। recorded सुविधा 24 घंटे; बात सुबह 8 से रात 10 बजे तक, सोमवार से शनिवार।",
    source: {
      file: "docs/sources/rbi/2026-07-01-rbios-2026-faq.txt",
      url: "https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=3407",
      quote: "The IVRS facility on Toll Free No. 14448 is available 24x7.",
    },
  },
  {
    number: "1947",
    titleHi: "आधार (UIDAI) हेल्पलाइन",
    whenHi: "आधार का ग़लत इस्तेमाल लगे, या biometric lock में मदद चाहिए।",
    source: { file: "docs/sources/gov/2026-11-23-uidai.txt", url: "https://uidai.gov.in/en/", quote: "Toll-free Number 1947" },
  },
];

export const HELP_SITES: readonly { href: string; labelHi: string; whenHi: string }[] = [
  { href: "https://cybercrime.gov.in", labelHi: "cybercrime.gov.in", whenHi: "1930 न लगे, तो यहाँ online शिकायत।" },
  {
    href: "https://sancharsaathi.gov.in",
    labelHi: "sancharsaathi.gov.in",
    whenHi: "ठगी वाले call या SMS की शिकायत (चक्षु), चोरी या गुम फ़ोन block करवाना, अपने नाम के mobile नंबर देखना।",
  },
  { href: "https://cms.rbi.org.in", labelHi: "cms.rbi.org.in", whenHi: "बैंक जवाब न दे, तो RBI Ombudsman को मुफ़्त शिकायत।" },
];
