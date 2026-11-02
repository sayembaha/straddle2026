import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AiError, complete } from "@/lib/anthropic";
import { cleanSeries, locateVerbatim, type Analysis } from "@/lib/analysis";
import { getFacts } from "@/lib/fred";
import { draftSystem, draftUser, parseDraft, type Draft } from "@/lib/draft";

export const maxDuration = 60;

const MODEL = process.env.DRAFT_MODEL || "claude-sonnet-5-5";

// Draft pipeline, step 2: write the LinkedIn post around the writer's own words.
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("id").eq("id", auth.user.id).maybeSingle();
  if (!profile) return NextResponse.json({ error: "Your seat is not active." }, { status: 403 });

  const body = (await request.json().catch(() => null)) as {
    take?: unknown; maxWords?: unknown; analysis?: Partial<Analysis>; draftId?: unknown;
  } | null;
  const take = typeof body?.take === "string" ? body.take.trim() : "";
  if (!take || take.length > 8000) return NextResponse.json({ error: "Write your take first." }, { status: 400 });
  const maxWords = typeof body?.maxWords === "number" && body.maxWords >= 20 && body.maxWords <= 2000 ? body.maxWords : null;
  const a = body?.analysis;
  if (!a || typeof a.stance !== "string") return NextResponse.json({ error: "Read the take first." }, { status: 400 });

  // Never trust the client's phrases: keep only those that are really in the take.
  const analysis: Analysis = {
    stance: a.stance.slice(0, 500),
    claims: (Array.isArray(a.claims) ? a.claims : []).slice(0, 6).map((c) => ({ text: String(c?.text ?? "").slice(0, 300), kind: c?.kind ?? "opinion" })),
    phrases: (Array.isArray(a.phrases) ? a.phrases : []).map((p) => (typeof p === "string" ? locateVerbatim(p, take) : null)).filter((p): p is string => !!p).slice(0, 8),
    figures: [],
    gaps: [],
    series: cleanSeries(a.series),
  };
  const facts = await getFacts(analysis.series);

  let draft: Draft | null = null;
  try {
    let missing: string[] = [];
    let slop: string[] = [];
    const cost = (d: Draft) => d.missing.length * 3 + d.slop.length + (d.overLimit ? 2 : 0);
    for (let attempt = 0; attempt < 2; attempt++) {
      const raw = await complete({ model: MODEL, system: draftSystem(maxWords), user: draftUser(take, analysis, facts, missing, slop), maxTokens: 1600 });
      const parsed = parseDraft(raw, take, analysis, maxWords, facts);
      if (parsed && (!draft || cost(parsed) < cost(draft))) draft = parsed;
      if (draft && cost(draft) === 0) break;
      missing = draft?.missing ?? [];
      slop = (draft?.slop ?? []).map((h) => h.match);
    }
  } catch (e) {
    console.error("draft failed", e);
    const off = e instanceof AiError && e.code === "no_key";
    return NextResponse.json({ error: off ? "Drafting is not switched on yet." : "Straddle could not write the draft just now. Try again." }, { status: off ? 503 : 502 });
  }
  if (!draft) return NextResponse.json({ error: "Straddle could not write the draft just now. Try again." }, { status: 502 });

  // Count the draft only once there is one to show.
  const { data: left, error: useError } = await supabase.rpc("use_draft");
  if (useError) console.error("use_draft failed", useError.message);
  if (left === -1) return NextResponse.json({ error: "You have used all 30 drafts for this month." }, { status: 402 });

  // Keep every generation so the prompt can be tuned later. Never blocks the response.
  const row = { draft, model: MODEL };
  const draftId = typeof body?.draftId === "string" ? body.draftId : null;
  const saved = draftId
    ? await supabase.from("drafts").update(row).eq("id", draftId)
    : await supabase.from("drafts").insert({ user_id: auth.user.id, take, channels: ["LinkedIn"], max_words: maxWords, analysis, ...row });
  if (saved.error) console.error("save draft failed", saved.error.message);

  return NextResponse.json({ draft, left: typeof left === "number" ? left : null });
}
