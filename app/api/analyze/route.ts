import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AiError, complete } from "@/lib/anthropic";
import { ANALYSIS_SYSTEM, parseAnalysis } from "@/lib/analysis";

export const maxDuration = 60;

const CHANNELS = ["LinkedIn", "X thread", "Substack", "Beehiiv"];
const MODEL = process.env.ANALYSIS_MODEL || "claude-haiku-5-5";

// Draft pipeline, step 1. Signed-in writers only; the take is required.
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("id").eq("id", auth.user.id).maybeSingle();
  if (!profile) return NextResponse.json({ error: "Your seat is not active." }, { status: 403 });

  const body = (await request.json().catch(() => null)) as {
    take?: unknown; channels?: unknown; maxWords?: unknown;
  } | null;
  const take = typeof body?.take === "string" ? body.take.trim() : "";
  if (!take) return NextResponse.json({ error: "Write your take first." }, { status: 400 });
  if (take.length > 8000) return NextResponse.json({ error: "Keep the take under 8,000 characters." }, { status: 400 });
  const channels = (Array.isArray(body?.channels) ? body.channels : []).filter((c): c is string => CHANNELS.includes(c as string));
  const maxWords = typeof body?.maxWords === "number" && body.maxWords >= 20 && body.maxWords <= 2000 ? body.maxWords : null;

  let analysis;
  try {
    const raw = await complete({ model: MODEL, system: ANALYSIS_SYSTEM, user: `<take>\n${take}\n</take>`, maxTokens: 900 });
    analysis = parseAnalysis(raw, take);
  } catch (e) {
    console.error("analyze failed", e);
    const msg = e instanceof AiError && e.code === "no_key" ? "Drafting is not switched on yet." : "Straddle could not read your take just now. Try again.";
    return NextResponse.json({ error: msg }, { status: e instanceof AiError && e.code === "no_key" ? 503 : 502 });
  }
  if (!analysis) return NextResponse.json({ error: "Straddle could not read your take just now. Try again." }, { status: 502 });

  // Keep every generation (your words verbatim) so the prompt can be tuned later. Never blocks the response.
  const { error: saveError } = await supabase
    .from("drafts")
    .insert({ user_id: auth.user.id, take, channels, max_words: maxWords, analysis });
  if (saveError) console.error("save failed", saveError.message);

  return NextResponse.json({ analysis });
}
