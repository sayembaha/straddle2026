import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Your desk — Straddle" };

const link = "inline-flex min-h-[44px] items-center px-1 text-[14.5px] text-mute no-underline hover:text-ink";

// The signed-in app frame: header with the two places a writer goes, Compose and Library.
// Signed-in only: the middleware sends visitors without a session to /login.
export default async function DeskLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const { data: profile } = auth.user
    ? await supabase.from("profiles").select("drafts_used, draft_month").eq("id", auth.user.id).maybeSingle()
    : { data: null };
  const month = new Date().toISOString().slice(0, 7);
  const left = profile ? 30 - (profile.draft_month === month ? profile.drafts_used : 0) : null;
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center gap-x-8 gap-y-1 px-5 py-2 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5 text-ink no-underline">
            <span className="inline-block h-3 w-3 bg-ink" />
            <span className="font-mono text-sm font-medium tracking-[0.22em]">STRADDLE</span>
          </Link>
          <nav className="flex items-center gap-6" aria-label="Desk">
            <Link href="/desk" className={link}>Compose</Link>
            <Link href="/desk/library" className={link}>Library</Link>
          </nav>
          <div className="ml-auto flex items-center gap-4 text-[13px] text-mute">
            {left !== null && <span className="font-mono text-[11px] uppercase tracking-[0.14em]">{left} drafts left</span>}
            {auth.user && (
              <form action="/auth/signout" method="post">
                <button type="submit" className="min-h-[44px] px-1 text-[13px] text-mute hover:text-ink">Sign out</button>
              </form>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1180px] px-5 py-[clamp(28px,4vw,56px)] sm:px-8">{children}</main>
    </div>
  );
}
