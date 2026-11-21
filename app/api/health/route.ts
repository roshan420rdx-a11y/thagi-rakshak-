// जाँच का रास्ता: app चल रहा है या नहीं (CI का smoke test और uptime जाँच इसी को देखते हैं)
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ status: "ok", service: "thagi-rakshak", time: new Date().toISOString() });
}
