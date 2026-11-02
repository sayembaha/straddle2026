import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AiError } from "@/lib/anthropic";
import { cleanSeries, type Analysis } from "@/lib/analysis";
import { getFacts } from "@/lib/fred";
import { research } from "@/lib/research";

export const maxDuration = 60;

// Long-form step 2: verified data from FRED plus cited facts from the web. Does not use a draft.
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("id").eq("id", auth.user.id).maybeSingle();
  if (!profile) return NextResponse.json({ error: "Your seat is not active." }, { status: 403 });

  const body = (await request.json().catch(() => null)) as { take?: unknown; analysis?: Partial<Analysis> } | null;
  const take = typeof body?.take === "string" ? body.take.trim() : "";
  const a = body?.analysis;
  if (!take || take.length > 8000 || !a || typeof a.stance !== "string") return NextResponse.json({ error: "Read the take first." }, { status: 400 });
  const analysis = { stance: a.stance.slice(0, 500), series: cleanSeries(a.series) } as Analysis;

  const [data, web] = await Promise.all([
    getFacts(analysis.series),
    research(take, analysis).catch((e) => {
      console.error("research failed", e instanceof AiError ? `${e.code}: ${e.message}` : e);
      return null;
    }),
  ]);
  if (web === null && !data.length) return NextResponse.json({ error: "Straddle could not research this just now. Try again." }, { status: 502 });
  return NextResponse.json({
    data: data.map((f, i) => ({ id: `d${i + 1}`, title: f.title, asOf: f.asOf, line: f.line })),
    web: web ?? [],
    webFailed: web === null,
  });
}
