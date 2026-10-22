"use client";

import { useRef, useState } from "react";

const CHANNELS = ["LinkedIn", "X thread", "Substack", "Beehiiv"] as const;
type Channel = (typeof CHANNELS)[number];

const EXAMPLES = [
  "The Fed cut in September for the labour market, not inflation. Payroll revisions matter more than the next CPI print.",
  "Nvidia's problem is supply, not demand. Until Blackwell ships at volume the guide is a capacity number dressed as a forecast.",
  "Bangladesh's reserve build is real but borrowed. Remittances are funding it, not exports, and that reverses fast.",
];

const field =
  "w-full border border-line2 bg-white px-3.5 text-[16px] text-ink placeholder:text-faint focus:border-ink focus:outline-none";

function addOn(open: boolean) {
  return `inline-flex min-h-[36px] items-center gap-1.5 border px-3 text-[13.5px] ${
    open ? "border-ink bg-white text-ink" : "border-line2 bg-white text-mute hover:border-sky hover:text-ink"
  }`;
}

// Compose. The take is the hero and the only required field; everything else is a
// compact strip under it, and the two optional add-ons stay closed until asked for.
export default function ComposeForm() {
  const [take, setTake] = useState("");
  const [channels, setChannels] = useState<Channel[]>(["LinkedIn"]);
  const [maxWords, setMaxWords] = useState("");
  const [showSource, setShowSource] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [source, setSource] = useState("");
  const [chart, setChart] = useState("");
  const [fileName, setFileName] = useState("");
  const [note, setNote] = useState("");
  const [exampleAt, setExampleAt] = useState(0);
  const takeRef = useRef<HTMLTextAreaElement>(null);

  const words = take.trim() ? take.trim().split(/\s+/).length : 0;
  const limit = maxWords ? Number(maxWords) : null;
  const limitBad = limit !== null && (limit < 20 || limit > 2000);
  const ready = words > 0 && channels.length > 0 && !limitBad;

  function toggle(c: Channel) {
    setChannels((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));
  }

  function useExample() {
    setTake(EXAMPLES[exampleAt]);
    setExampleAt((i) => (i + 1) % EXAMPLES.length);
    takeRef.current?.focus();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    setNote("Your take is ready. Drafting is connected in the next build step, so nothing was generated.");
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <div className="border border-line2 bg-white focus-within:border-ink">
        <label htmlFor="take" className="sr-only">
          Your take
        </label>
        <textarea
          id="take"
          name="take"
          ref={takeRef}
          rows={4}
          value={take}
          onChange={(e) => setTake(e.target.value)}
          placeholder={EXAMPLES[0]}
          className="min-h-[132px] w-full resize-y border-0 bg-transparent px-4 py-3.5 text-[17px] leading-[1.55] text-ink placeholder:text-faint focus:outline-none"
        />

        <div className="flex flex-wrap items-center gap-2 border-t border-line bg-wash px-3 py-2.5">
          <button type="button" aria-expanded={showSource} onClick={() => setShowSource((v) => !v)} className={addOn(showSource)}>
            <span aria-hidden="true" className="font-mono text-[15px] leading-none">
              {showSource ? "−" : "+"}
            </span>
            Source link
          </button>
          <button type="button" aria-expanded={showChart} onClick={() => setShowChart((v) => !v)} className={addOn(showChart)}>
            <span aria-hidden="true" className="font-mono text-[15px] leading-none">
              {showChart ? "−" : "+"}
            </span>
            Chart
          </button>
          <span className="ml-auto font-mono text-[11.5px] uppercase tracking-[0.12em] text-faint">
            {words} {words === 1 ? "word" : "words"}
          </span>
        </div>

        {showSource && (
          <div className="border-t border-line px-4 py-4">
            <label htmlFor="source" className="mb-2 block text-[13.5px] font-semibold">
              Link to a release, filing or article
            </label>
            <input id="source" name="source" type="url" value={source} onChange={(e) => setSource(e.target.value)} placeholder="https://" className={`${field} min-h-[46px]`} />
            <p className="mt-2 text-[13px] text-mute">Straddle reads the page and cites it in your post.</p>
          </div>
        )}

        {showChart && (
          <div className="flex flex-col gap-4 border-t border-line px-4 py-4">
            <div>
              <label htmlFor="chart" className="mb-2 block text-[13.5px] font-semibold">
                Ask for a series in plain English
              </label>
              <input id="chart" name="chart" type="text" value={chart} onChange={(e) => setChart(e.target.value)} placeholder="US CPI vs Fed funds rate since 2020" className={`${field} min-h-[46px]`} />
            </div>
            <div>
              <label htmlFor="file" className="mb-2 block text-[13.5px] font-semibold">
                Or upload your own data
              </label>
              <input
                id="file"
                name="file"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                className="block w-full text-[14px] text-mute file:mr-3 file:min-h-[42px] file:cursor-pointer file:border file:border-line2 file:bg-white file:px-4 file:text-[14px] file:text-ink hover:file:border-ink"
              />
              <p className="mt-2 text-[13px] text-mute">{fileName ? `${fileName} selected. Charting from files is built in week 3.` : "CSV or Excel."}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="m-0 text-[13px] text-mute">Straddle never invents your opinion. It won&rsquo;t run without your take.</p>
        <button type="button" onClick={useExample} className="text-[13px] text-sky-ink underline underline-offset-2 hover:text-ink">
          Try an example
        </button>
      </div>

      <div className="flex flex-col gap-3 border-y border-line py-4">
        <div role="group" aria-labelledby="channels-label" className="flex flex-wrap items-center gap-2">
          <span id="channels-label" className="w-[96px] shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
            Publish to
          </span>
          {CHANNELS.map((c) => {
            const on = channels.includes(c);
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(c)}
                className={`min-h-[38px] border px-3.5 text-[13.5px] ${on ? "border-ink bg-ink text-white" : "border-line2 bg-white text-mute hover:border-sky hover:text-ink"}`}
              >
                {c}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <label htmlFor="length" className="w-[96px] shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
            Length
          </label>
          <div className="flex items-center gap-2 text-[13.5px] text-ink">
            <span>Max</span>
            <input
              id="length"
              name="maxWords"
              type="number"
              inputMode="numeric"
              min={20}
              max={2000}
              step={10}
              value={maxWords}
              onChange={(e) => setMaxWords(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="250"
              aria-describedby="length-hint"
              className="min-h-[38px] w-[84px] border border-line2 bg-white px-2.5 text-center font-mono text-[14px] text-ink placeholder:text-faint focus:border-ink focus:outline-none"
            />
            <span>words</span>
          </div>
          <span id="length-hint" className="text-[12.5px] text-faint">
            Leave blank and Straddle picks a length that suits each channel.
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={!ready}
          className="min-h-[52px] w-fit border border-brand bg-brand px-8 text-base font-medium text-white hover:border-ink hover:bg-ink disabled:cursor-not-allowed disabled:border-line2 disabled:bg-wash disabled:text-faint"
        >
          Draft it
        </button>
        {!ready && (
          <p className="m-0 text-[13px] text-mute">
            {limitBad ? "Pick a word limit between 20 and 2,000, or leave it blank." : "Write your take and pick at least one channel."}
          </p>
        )}
        <p role="status" className="m-0 min-h-[1.5em] text-[14px] text-mute">
          {note}
        </p>
      </div>
    </form>
  );
}
