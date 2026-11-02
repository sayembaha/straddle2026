import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AiError, complete } from "@/lib/anthropic";
import { outlineSystem, outlineUser, parseOutline } from "@/lib/outline";

export const maxDuration = 60;
const MODEL = process.env.DRAFT_MODEL || "claude-sonnet-5-5";

type F = { id?: unknown; line?: unknown };

// Long-form step 3: an outline for the writer to approve. No prose is written here.
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("id").eq("id", auth.user.id).maybeSingle();
  if (!profile) return NextResponse.json({ error: "Your seat is not active." }, { status: 403 });

  const body = (await request.json().catch(() => null)) as {
    take?: unknown; targetWords?: unknown; stance?: unknown; claims?: unknown; facts?: F[];
  } | null;
  const take = typeof body?.take === "string" ? body.take.trim() : "";
  if (!take || take.length > 8000) return NextResponse.json({ error: "Write your take first." }, { status: 400 });
  const target = typeof body?.targetWords === "number" ? Math.min(2000, Math.max(500, body.targetWords)) : 1000;
  const facts = (Array.isArray(body?.facts) ? body!.facts! : [])
    .filter((f): f is { id: string; line: string } => typeof f?.id === "string" && typeof f?.line === "string")
    .slice(0, 14).map((f) => ({ id: f.id.slice(0, 8), line: f.line.slice(0, 500) }));
  const claims = (Array.isArray(body?.claims) ? body!.claims as unknown[] : []).filter((c): c is string => typeof c === "string").slice(0, 6);

  try {
    for (let i = 0; i < 2; i++) {
      const raw = await complete({
        model: MODEL, system: outlineSystem(target), maxTokens: 1500,
        user: outlineUser(take, typeof body?.stance === "string" ? body.stance.slice(0, 500) : "", claims, facts),
      });
      const outline = parseOutline(raw, take, facts.map((f) => f.id));
      if (outline) return NextResponse.json({ outline });
    }
  } catch (e) {
    console.error("outline failed", e instanceof AiError ? `${e.code}: ${e.message}` : e);
  }
  return NextResponse.json({ error: "Straddle could not plan the article just now. Try again." }, { status: 502 });
}
