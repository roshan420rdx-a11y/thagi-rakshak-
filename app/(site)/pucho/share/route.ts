// Share का server वाला रास्ता: सिर्फ़ तब, जब फ़ोन में service worker न हो (आम तौर पर नहीं होता, क्योंकि Share सिर्फ़
// home screen पर जोड़े गए ऐप से आता है, और उसमें service worker होता है)। message (body) कभी पढ़ा या रखा नहीं जाता;
// बस "पहले पूछो" पर भेजना, जहाँ हाथ से चिपकाने की बात दिखती है। पता relative, ताकि proxy के पीछे भी सही रहे।
function goTo(location: string): Response {
  return new Response(null, { status: 303, headers: { Location: location, "Cache-Control": "no-store" } });
}

export function POST(): Response {
  return goTo("/pucho?shared=0");
}

export function GET(): Response {
  return goTo("/pucho");
}
