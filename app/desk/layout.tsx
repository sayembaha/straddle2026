import Link from "next/link";

export const metadata = { title: "Your desk — Straddle" };

const link = "inline-flex min-h-[44px] items-center px-1 text-[14.5px] text-mute no-underline hover:text-ink";

// The signed-in app frame: header with the two places a writer goes, Compose and Library.
// Sign-in is added on plan day 3; until then this area is open for preview only.
export default function DeskLayout({ children }: { children: React.ReactNode }) {
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
          <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.14em] text-mute">Preview build</span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1180px] px-5 py-[clamp(28px,4vw,56px)] sm:px-8">{children}</main>
    </div>
  );
}
