"use client";

import type { Outline } from "@/lib/outline";
import type { WebFact } from "@/lib/research";

export type DataFact = { id: string; title: string; asOf: string; line: string };
export type Plan = { outline: Outline; web: WebFact[]; data: DataFact[]; webFailed: boolean };

const btn = "min-h-[32px] border border-line2 bg-white px-2.5 text-[12.5px] text-mute hover:border-ink hover:text-ink disabled:opacity-40";

// The writer's approval step for a long article: reorder, rename or cut sections before anything is written.
export default function OutlineCard({ plan, onChange }: { plan: Plan; onChange: (p: Plan) => void }) {
  const { outline, web, data } = plan;
  const set = (sections: Outline["sections"]) => onChange({ ...plan, outline: { ...outline, sections } });
  const move = (i: number, d: number) => {
    const s = [...outline.sections];
    const j = i + d;
    if (j < 0 || j >= s.length) return;
    [s[i], s[j]] = [s[j], s[i]];
    set(s);
  };
  const lookup = (id: string) => web.find((w) => w.id === id) ?? null;
  const dataOf = (id: string) => data.find((d) => d.id === id) ?? null;

  return (
    <section aria-label="Article outline" className="flex flex-col gap-4 border border-ink bg-white p-5">
      <p className="m-0 font-mono text-[11px] uppercase tracking-[0.16em] text-mute">Article outline</p>
      <input
        aria-label="Article title"
        value={outline.title}
        onChange={(e) => onChange({ ...plan, outline: { ...outline, title: e.target.value } })}
        className="w-full border-0 border-b border-line bg-transparent pb-2 text-[22px] font-semibold text-ink focus:border-ink focus:outline-none"
      />
      <ol className="m-0 flex list-none flex-col gap-4 p-0">
        {outline.sections.map((s, i) => (
          <li key={i} className="flex flex-col gap-2 border-l-2 border-line2 pl-4">
            <div className="flex items-start gap-2">
              <span className="mt-2 font-mono text-[12px] text-faint">{i + 1}</span>
              <input
                aria-label={`Section ${i + 1} heading`}
                value={s.heading}
                onChange={(e) => set(outline.sections.map((x, k) => (k === i ? { ...x, heading: e.target.value } : x)))}
                className="min-w-0 flex-1 border border-transparent px-1 py-1 text-[17px] font-medium text-ink hover:border-line2 focus:border-ink focus:outline-none"
              />
              <button type="button" className={btn} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
              <button type="button" className={btn} onClick={() => move(i, 1)} disabled={i === outline.sections.length - 1} aria-label="Move down">↓</button>
              <button type="button" className={btn} onClick={() => set(outline.sections.filter((_, k) => k !== i))} disabled={outline.sections.length <= 2}>Cut</button>
            </div>
            <p className="m-0 text-[14.5px] leading-[1.55] text-mute">{s.point}</p>
            {s.yours && (
              <p className="m-0 text-[14px] text-ink"><span className="mr-2 inline-block h-2 w-2 bg-ink align-middle" />Builds on your words: <span className="font-medium">&ldquo;{s.yours}&rdquo;</span></p>
            )}
            {s.facts.map((id) => {
              const w = lookup(id);
              const d = dataOf(id);
              if (w)
                return (
                  <p key={id} className="m-0 text-[14px] leading-[1.5] text-mute">
                    <span className="mr-2 inline-block h-2 w-2 bg-ai align-middle" />
                    {w.against && <span className="mr-1 font-medium text-ink">Against your view:</span>}
                    {w.claim}{" "}
                    <a href={w.url} target="_blank" rel="noopener noreferrer" className="text-sky-ink underline">{w.title}</a>
                  </p>
                );
              if (d)
                return (
                  <p key={id} className="m-0 text-[14px] leading-[1.5] text-mute">
                    <span className="mr-2 inline-block h-2 w-2 bg-sky-ink align-middle" />
                    <span className="font-medium text-ink">{d.title}, {d.asOf}.</span> FRED data, computed by code.
                  </p>
                );
              return null;
            })}
          </li>
        ))}
      </ol>
      {plan.webFailed && <p className="m-0 text-[13px] text-mute">Web research did not load this time, so the outline uses your take and the FRED data only. Run it again to retry.</p>}
      {web.length === 0 && !plan.webFailed && <p className="m-0 text-[13px] text-mute">No web fact passed the check (every number must appear in its source). Nothing was added that cannot be verified.</p>}
      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <button type="button" disabled className="min-h-[44px] border border-line2 bg-wash px-5 text-[14px] text-faint">Write the article</button>
        <p className="m-0 text-[13px] text-mute">Writing from this outline is the next step. Reorder, rename or cut sections first.</p>
      </div>
    </section>
  );
}
