"use client";

import { useState } from "react";

const CHANNELS = ["LinkedIn", "X thread", "Substack", "Beehiiv"] as const;
type Channel = (typeof CHANNELS)[number];

const label = "mb-2 block text-[14px] font-semibold";
const field = "w-full border border-line2 bg-white px-3.5 text-[16px] text-ink placeholder:text-faint focus:border-ink";

// Compose form. The take is the only required field; the source link and the chart are
// optional and sit inside disclosures. Drafting itself is connected on plan day 5.
export default function ComposeForm() {
  const [take, setTake] = useState("");
  const [channels, setChannels] = useState<Channel[]>(["LinkedIn"]);
  const [source, setSource] = useState("");
  const [chart, setChart] = useState("");
  const [fileName, setFileName] = useState("");
  const [note, setNote] = useState("");

  const ready = take.trim().length > 0 && channels.length > 0;

  function toggle(c: Channel) {
    setChannels((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    setNote("Your take is ready. Drafting is connected in the next build step, so nothing was generated.");
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-7" noValidate>
      <div>
        <label htmlFor="take" className={label}>
          Your take <span className="font-normal text-mute">&mdash; required</span>
        </label>
        <textarea
          id="take"
          name="take"
          rows={4}
          value={take}
          onChange={(e) => setTake(e.target.value)}
          placeholder="One sentence. Say what you think and why it matters."
          className={`${field} min-h-[112px] resize-y py-3 leading-[1.5]`}
        />
        <p className="mt-2 text-[13px] text-mute">Straddle never invents your opinion. It won&rsquo;t run without this.</p>
      </div>

      <details className="group border border-line">
        <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between px-4 text-[14.5px] font-semibold marker:hidden">
          <span>React to a source <span className="font-normal text-mute">&mdash; optional</span></span>
          <span className="font-mono text-lg text-mute group-open:hidden" aria-hidden="true">+</span>
          <span className="hidden font-mono text-lg text-mute group-open:inline" aria-hidden="true">&minus;</span>
        </summary>
        <div className="border-t border-line p-4">
          <label htmlFor="source" className={label}>Link to a release, filing or article</label>
          <input id="source" name="source" type="url" value={source} onChange={(e) => setSource(e.target.value)} placeholder="https://" className={`${field} min-h-[48px]`} />
          <p className="mt-2 text-[13px] text-mute">Straddle reads the page and cites it in your post.</p>
        </div>
      </details>

      <details className="group border border-line">
        <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between px-4 text-[14.5px] font-semibold marker:hidden">
          <span>Add a chart <span className="font-normal text-mute">&mdash; optional</span></span>
          <span className="font-mono text-lg text-mute group-open:hidden" aria-hidden="true">+</span>
          <span className="hidden font-mono text-lg text-mute group-open:inline" aria-hidden="true">&minus;</span>
        </summary>
        <div className="flex flex-col gap-5 border-t border-line p-4">
          <div>
            <label htmlFor="chart" className={label}>Ask for a series in plain English</label>
            <input id="chart" name="chart" type="text" value={chart} onChange={(e) => setChart(e.target.value)} placeholder="US CPI vs Fed funds rate since 2020" className={`${field} min-h-[48px]`} />
          </div>
          <div>
            <label htmlFor="file" className={label}>Or upload your own data</label>
            <input
              id="file"
              name="file"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              className="block w-full text-[14px] text-mute file:mr-3 file:min-h-[44px] file:cursor-pointer file:border file:border-line2 file:bg-white file:px-4 file:text-[14px] file:text-ink hover:file:border-ink"
            />
            <p className="mt-2 text-[13px] text-mute">{fileName ? `${fileName} selected. Charting from files is built in week 3.` : "CSV or Excel. You can also skip the chart and post text only."}</p>
          </div>
        </div>
      </details>

      <fieldset className="m-0 border-0 p-0">
        <legend className={label}>Publish to</legend>
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map((c) => {
            const on = channels.includes(c);
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(c)}
                className={`min-h-[44px] border px-[18px] text-[14.5px] ${on ? "border-ink bg-ink text-white" : "border-line2 bg-white text-mute hover:border-ink hover:text-ink"}`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={!ready}
          className="min-h-[52px] w-fit bg-brand px-8 text-base font-medium text-white hover:bg-ink disabled:cursor-not-allowed disabled:bg-line2 disabled:text-white"
        >
          Draft it
        </button>
        {!ready && <p className="m-0 text-[13px] text-mute">Add your take and pick at least one channel.</p>}
        <p role="status" className="m-0 min-h-[1.5em] text-[14px] text-mute">{note}</p>
      </div>
    </form>
  );
}
