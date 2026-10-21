import Link from "next/link";

export default function LibraryPage() {
  return (
    <div className="flex max-w-[720px] flex-col gap-8">
      <div>
        <p className="mb-3.5 font-mono text-[11.5px] font-medium uppercase tracking-[0.2em] text-mute">Library</p>
        <h1 className="m-0 font-display text-[clamp(32px,4.4vw,48px)] font-normal leading-[1.08]">Your drafts</h1>
      </div>
      <div className="flex flex-col items-start gap-4 border border-dashed border-line2 p-[clamp(24px,3vw,36px)]">
        <p className="m-0 text-[16px] font-semibold">No drafts yet.</p>
        <p className="m-0 max-w-[460px] text-[15px] text-mute">Drafts you save from Compose appear here, with a Draft or Posted status and a search box.</p>
        <Link href="/desk" className="inline-flex min-h-[48px] items-center bg-brand px-6 text-[15px] font-medium text-white no-underline hover:bg-ink">Write a take</Link>
      </div>
    </div>
  );
}
