import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Magic-link landing. Supabase sends its own `code` token; our invite code travels as `invite`.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("code");
  const invite = searchParams.get("invite");
  const supabase = createClient();

  if (!token) return NextResponse.redirect(`${origin}/login?error=link`);
  const { error } = await supabase.auth.exchangeCodeForSession(token);
  if (error) return NextResponse.redirect(`${origin}/login?error=link`);

  if (invite) {
    const { data: result } = await supabase.rpc("redeem_invite", { p_code: invite });
    if (result !== "ok") {
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/login?error=${result === "full" ? "full" : "invalid"}`);
    }
  } else {
    // Returning user: must already have a profile.
    const { data: user } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.user?.id ?? "").maybeSingle();
    if (!profile) {
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/login?error=invalid`);
    }
  }
  return NextResponse.redirect(`${origin}/desk`);
}
