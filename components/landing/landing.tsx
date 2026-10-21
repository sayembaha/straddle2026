import DemoChart from "./demo-chart";
import AccessForms from "./access-forms";

const wrap = "mx-auto w-full max-w-[1180px] px-5 sm:px-8";
const mono = "font-mono uppercase";
const eyebrow = `${mono} text-[11.5px] font-medium tracking-[0.2em] text-mute`;
const h2 = "font-display font-normal text-[clamp(32px,4.2vw,54px)] leading-[1.08] tracking-[-0.01em] [text-wrap:balance]";

function Tick() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className="mt-[3px] flex-none" aria-hidden="true">
      <path d="M3 8.5l3.2 3.2L13 5" fill="none" stroke="#0B1F3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Landing() {
  return (
    <div className="bg-white text-ink">
      {/* NAV */}
      <header className="border-b border-line">
        <div className={`${wrap} flex flex-wrap items-center gap-5 py-[18px]`}>
          <a href="#top" className="flex items-center gap-2.5 text-ink no-underline">
            <span className="inline-block h-[13px] w-[13px] bg-ink" />
            <span className="font-mono text-[15px] font-medium tracking-[0.22em]">STRADDLE</span>
          </a>
          <nav className="ml-auto flex flex-wrap items-center gap-x-7 gap-y-2" aria-label="Main">
            <a href="#how" className="text-[14.5px] text-mute no-underline hover:text-ink">How it works</a>
            <a href="#authored" className="text-[14.5px] text-mute no-underline hover:text-ink">Author-led</a>
            <a href="#publish" className="text-[14.5px] text-mute no-underline hover:text-ink">Publishing</a>
            <a href="#access" className="inline-flex min-h-[44px] items-center bg-brand px-5 text-[14.5px] font-medium text-white no-underline hover:bg-ink">
              Request access
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className={`${wrap} pb-[clamp(48px,5vw,72px)] pt-[clamp(56px,7vw,96px)]`}>
        <p className={`${eyebrow} mb-6`}>Private beta &middot; 20 founding seats</p>
        <h1 className="m-0 max-w-[940px] font-display text-[clamp(42px,6.4vw,78px)] font-normal leading-[1.04] tracking-[-0.015em]">
          You bring the take.<br />Straddle brings the data.
        </h1>
        <p className="mt-7 max-w-[620px] text-[clamp(16.5px,1.5vw,19px)] leading-[1.6] text-mute">
          One sentence of your market view becomes a publish-ready post, with a research-grade chart built from live data
          or your own file to back it up. Written for the people on the desk who also write.
        </p>
        <div className="mt-9 flex flex-wrap gap-3.5">
          <a href="#access" className="inline-flex min-h-[52px] items-center bg-brand px-7 text-base font-medium text-white no-underline hover:bg-ink">Request access</a>
          <a href="#how" className="inline-flex min-h-[52px] items-center border border-line2 px-7 text-base font-medium text-ink no-underline hover:border-ink">See how it works</a>
        </div>
        <p className={`${mono} mt-11 text-[11.5px] tracking-[0.16em] text-mute`}>
          Your spreadsheet &middot; FRED &middot; World Bank &middot; SEC EDGAR &middot; Any link you paste
        </p>
      </section>

      {/* PRODUCT PANEL */}
      <section className="bg-ink text-white">
        <div className={`${wrap} py-[clamp(56px,6vw,88px)]`}>
          <div className="mb-9 flex flex-wrap items-end gap-5">
            <h2 className="m-0 min-w-[280px] flex-[1_1_420px] font-display text-[clamp(30px,3.4vw,42px)] font-normal leading-[1.12]">One screen. Take in, post out.</h2>
            <p className="m-0 flex-[1_1_300px] text-[15.5px] text-[#A9BBD0]">No prompt engineering and no blank page. The chart is optional, so a post can be words only.</p>
          </div>

          <div className="flex flex-wrap border border-brand bg-white text-ink">
            {/* inputs */}
            <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-6 border-line p-[clamp(22px,2.6vw,32px)] lg:border-r">
              <p className={`${mono} m-0 text-[11px] font-medium tracking-[0.18em] text-mute`}>Your desk</p>
              <div>
                <p className="mb-2 text-[13.5px] font-semibold">Your take <span className="font-normal text-mute">&mdash; required</span></p>
                <div className="border border-ink p-3.5 text-[15px] leading-[1.5]">The market is underpricing how long the Fed stays on hold.</div>
                <p className="mt-2 text-[12.5px] text-mute">Straddle never invents your opinion. It can&rsquo;t run without this.</p>
              </div>
              <div>
                <p className="mb-2 text-[13.5px] font-semibold">React to a source <span className="font-normal text-mute">&mdash; optional</span></p>
                <div className="break-all border border-line2 p-3.5 font-mono text-[12.5px]">federalreserve.gov/newsevents/pressreleases/monetary20261029a.htm</div>
                <p className="mt-2 text-[12.5px] text-mute">Paste a release, filing or article. Straddle reads it and cites it in your post.</p>
              </div>
              <div>
                <p className="mb-2 text-[13.5px] font-semibold">Chart <span className="font-normal text-mute">&mdash; optional</span></p>
                <div className="border border-line2 p-3.5 text-[15px]">US CPI vs Fed funds rate, 2020 to now</div>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-2">
                  <span className="inline-flex items-center gap-[7px] border border-line2 px-3 py-2 text-[13px]">
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 11V3M8 3L5 6M8 3l3 3M3 12.5h10" fill="none" stroke="#0B1F3A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Upload CSV or Excel
                  </span>
                  <span className="text-[13px] text-mute">or paste your own table</span>
                </div>
                <p className="mt-2.5 text-[12.5px] text-mute">Ask in plain English and Straddle pulls the series. Bring your own numbers and it charts those instead. Or skip the chart and post text only.</p>
              </div>
              <div>
                <p className="mb-2.5 text-[13.5px] font-semibold">Publish to</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-ink px-[15px] py-[9px] text-[13.5px] text-white">LinkedIn</span>
                  {["X thread", "Substack", "Beehiiv"].map((c) => (
                    <span key={c} className="border border-line2 px-[15px] py-[9px] text-[13.5px] text-mute">{c}</span>
                  ))}
                </div>
              </div>
              <span className="inline-flex min-h-[48px] w-fit items-center bg-brand px-6 text-[15.5px] font-medium text-white">Draft it</span>
            </div>

            {/* output */}
            <div className="flex min-w-0 flex-[1.25_1_420px] flex-col gap-[22px] bg-wash p-[clamp(22px,2.6vw,32px)]">
              <div className="flex flex-wrap items-center gap-3">
                <p className={`${mono} m-0 text-[11px] font-medium tracking-[0.18em] text-mute`}>Draft &middot; LinkedIn</p>
                <span className="ml-auto inline-flex items-center gap-[7px] border border-ink bg-white px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.1em]">
                  <span className="inline-block h-[7px] w-[7px] bg-ink" />AUTHOR-LED
                </span>
              </div>
              <div className="text-[15px] leading-[1.62]">
                <p className="mb-3 font-medium">The market is underpricing how long the Fed stays on hold.</p>
                <p className="mb-3 text-ai">Headline CPI has spent two years grinding sideways above target while the funds rate has come off its peak only slowly. The chart puts both series side by side since 2020.</p>
                <p className="mb-3 font-medium">I have sat in three credit committees this quarter that repriced on the assumption of faster cuts.</p>
                <p className="mb-3 text-ai">That assumption needs the inflation line to keep falling.</p>
                <p className="font-medium">It stopped falling.</p>
              </div>
              <p className="m-0 flex flex-wrap gap-[18px] text-[12.5px] text-mute">
                <span className="inline-flex items-center gap-[7px]"><span className="inline-block h-[3px] w-[11px] bg-ink" />Your words</span>
                <span className="inline-flex items-center gap-[7px]"><span className="inline-block h-[3px] w-[11px] bg-[#9FB0C4]" />Straddle, from your data</span>
              </p>
              <figure className="m-0 border border-line bg-white p-5">
                <figcaption className="mb-1.5 text-[15px] font-semibold leading-snug">CPI has flattened while the funds rate grinds lower</figcaption>
                <DemoChart />
                <p className="mt-3.5 font-mono text-[10.5px] uppercase tracking-[0.06em] text-mute">Source: FRED (CPIAUCSL, FEDFUNDS) &middot; illustrative data</p>
              </figure>
              <div className="border-t border-line pt-[18px]">
                <div className="mb-2.5 flex flex-wrap items-baseline gap-2.5">
                  <span className="text-[13.5px] font-semibold">Authorship</span>
                  <span className="font-mono text-[13.5px] text-mute">68% your words and your numbers</span>
                </div>
                <div className="h-2 w-full bg-line"><div className="h-2 w-[68%] bg-brand" /></div>
                <ul className="m-0 mt-4 flex list-none flex-col gap-[9px] p-0 text-[13.5px]">
                  {["Opens with a stance, not a summary", "Carries a specific number from the chart", "Cites its source", "No stock phrases found"].map((t) => (
                    <li key={t} className="flex items-start gap-2.5"><Tick /><span>{t}</span></li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap items-center gap-3 border-t border-line pt-[18px]">
                <span className="inline-flex min-h-[46px] items-center bg-brand px-[22px] text-[15px] font-medium text-white">Post to LinkedIn</span>
                <span className="inline-flex min-h-[46px] items-center border border-line2 bg-white px-5 text-[15px]">Schedule</span>
                <span className="ml-auto font-mono text-[10.5px] uppercase tracking-[0.1em] text-mute">4 accounts connected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className={`${wrap} py-[clamp(64px,7vw,104px)]`}>
        <p className={`${eyebrow} mb-[18px]`}>How it works</p>
        <h2 className={`${h2} mb-12 max-w-[760px]`}>Three steps, and the hard one is already yours.</h2>
        <div className="flex flex-wrap gap-px border border-line bg-line">
          {[
            ["01", "State your take", "One sentence. Straddle then asks three short questions to pull out what you saw that nobody else did."],
            ["02", "Add data, or skip it", "Paste a link, upload your own file, or ask for a series in plain English. Straddle reads it, computes the numbers and charts them. No chart needed to publish."],
            ["03", "Post from here", "Connect your accounts once. Publish or schedule to all four without leaving the screen."],
          ].map(([n, t, d]) => (
            <div key={n} className="min-w-0 flex-[1_1_280px] bg-white p-[clamp(24px,2.6vw,34px)]">
              <p className="mb-[18px] font-mono text-xs tracking-[0.14em] text-mute">{n}</p>
              <h3 className="mb-3 text-[19px] font-semibold leading-[1.3]">{t}</h3>
              <p className="m-0 text-[15px] text-mute">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AUTHOR-LED */}
      <section id="authored" className="border-y border-line bg-wash">
        <div className={`${wrap} py-[clamp(64px,7vw,108px)]`}>
          <p className={`${eyebrow} mb-[18px]`}>Author-led</p>
          <h2 className={`${h2} mb-5 max-w-[860px]`}>Everyone can generate. Almost nobody can author.</h2>
          <p className="mb-[clamp(40px,4vw,56px)] max-w-[680px] text-[16.5px] leading-[1.6] text-mute">
            Generic AI writing fails for one reason: the machine supplies the opinion. Straddle inverts the job. You supply the view and the judgement.
            Straddle supplies the structure, the evidence and the format, then shows you exactly where the line between the two falls.
          </p>

          <div className="mb-[clamp(40px,4vw,56px)] flex flex-wrap">
            <div className="min-w-0 flex-[1_1_320px] border border-ink bg-white p-[clamp(26px,2.8vw,38px)]">
              <p className={`${mono} mb-5 text-[11px] font-medium tracking-[0.18em] text-mute`}>You bring</p>
              <ul className="m-0 flex list-none flex-col gap-[18px] p-0">
                {[["The stance", "One sentence, required before anything runs."], ["The judgement", "What you saw in a committee, a deal, a model."], ["The last word", "Every edit you make is kept and learned from."]].map(([t, d]) => (
                  <li key={t}><span className="mb-1 block text-[17px] font-semibold">{t}</span><span className="text-[14.5px] text-mute">{d}</span></li>
                ))}
              </ul>
            </div>
            <div className="min-w-0 flex-[1_1_320px] bg-ink p-[clamp(26px,2.8vw,38px)] text-white">
              <p className={`${mono} mb-5 text-[11px] font-medium tracking-[0.18em] text-[#A9BBD0]`}>Straddle brings</p>
              <ul className="m-0 flex list-none flex-col gap-[18px] p-0">
                {[["The structure", "Hook, argument, close, in the shape each platform reads."], ["The evidence", "Your file or a pulled series, computed in code and charted."], ["The format", "Thread splits, pull-quotes, TL;DR blocks, image sizes."]].map(([t, d]) => (
                  <li key={t}><span className="mb-1 block text-[17px] font-semibold">{t}</span><span className="text-[14.5px] text-[#A9BBD0]">{d}</span></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-[clamp(40px,4vw,56px)] flex flex-wrap gap-px border border-line bg-line">
            {[
              ["Your take is required", "Nothing generates from a blank field. Straddle will not invent an opinion for you, which is the single reason most AI posts read the way they do."],
              ["Three questions", "What surprised you. What would change your mind. What you have seen firsthand. The answers go into the draft, not into a prompt."],
              ["Your words stay yours", "Sentences you typed are carried into the post verbatim. Straddle writes around them. It does not smooth them out."],
              ["Provenance, in colour", "Navy is yours. Grey is Straddle. Click any grey line to replace it in your own words."],
              ["Authorship score", "Measured, not flattered. The share of the post that is your sentences and your figures. Clear 60% and it carries the Author-led mark."],
              ["Desk check", "Four tests before you publish: a stance, a specific number, a cited source, no stock phrases. Fail one and it names it."],
            ].map(([t, d]) => (
              <div key={t} className="min-w-0 flex-[1_1_290px] bg-white p-[clamp(24px,2.4vw,32px)]">
                <h3 className="mb-2.5 text-lg font-semibold">{t}</h3>
                <p className="m-0 text-[14.5px] text-mute">{d}</p>
              </div>
            ))}
          </div>

          <h3 className="mb-2 font-display text-[clamp(26px,2.8vw,34px)] font-normal leading-[1.15]">See what you are not publishing.</h3>
          <p className="mb-7 max-w-[620px] text-[15.5px] text-mute">Optional, and quietly satisfying. Straddle shows what a generic prompt would have written on the same topic, beside what you actually wrote.</p>
          <div className="flex flex-wrap gap-[clamp(16px,2vw,24px)]">
            <div className="min-w-0 flex-[1_1_320px] border border-dashed border-line2 p-[clamp(22px,2.4vw,30px)]">
              <p className={`${mono} mb-3.5 text-[11px] font-medium tracking-[0.18em] text-mute`}>Generic prompt</p>
              <p className="m-0 text-[15.5px] leading-[1.6] text-[#6E7E92]">In today&rsquo;s fast-paced macro landscape, investors must navigate an increasingly complex rate environment. It&rsquo;s not just about inflation, it&rsquo;s about positioning. Here are three key takeaways every professional should consider.</p>
            </div>
            <div className="min-w-0 flex-[1_1_320px] border border-ink bg-white p-[clamp(22px,2.4vw,30px)]">
              <p className={`${mono} mb-3.5 text-[11px] font-medium tracking-[0.18em] text-mute`}>Your draft</p>
              <p className="m-0 text-[15.5px] leading-[1.6]">The market is underpricing how long the Fed stays on hold. I sat in three credit committees this quarter that priced in faster cuts. The inflation line stopped falling.</p>
            </div>
          </div>
          <p className="mt-[clamp(32px,3vw,44px)] max-w-[680px] text-[15.5px] text-mute">Every phrase you rewrite is remembered as a rule. The longer you use Straddle, the less of it there is in what you publish.</p>
        </div>
      </section>

      {/* PUBLISHING */}
      <section id="publish" className="bg-ink text-white">
        <div className={`${wrap} py-[clamp(56px,6vw,92px)]`}>
          <div className="mb-10 flex flex-wrap items-end gap-5">
            <h2 className="m-0 min-w-[280px] flex-[1_1_420px] font-display text-[clamp(30px,3.6vw,46px)] font-normal leading-[1.12]">Written once. Shaped four ways.<br />Posted without leaving.</h2>
            <p className="m-0 flex-[1_1_280px] text-[15.5px] text-[#A9BBD0]">Connect your accounts once. Publish now or schedule, chart attached, from the same screen you wrote in.</p>
          </div>
          <div className="flex flex-wrap gap-px border border-brand bg-brand">
            {[
              ["LinkedIn", "Hook on line one, breathing room between lines, chart sized for the feed.", "Post or schedule"],
              ["X", "Split into a numbered thread, every post inside the character limit.", "Post or schedule"],
              ["Beehiiv", "Modular blocks with a TL;DR up top and room for a sponsor slot.", "Sends as a draft"],
              ["Substack", "Longform with headers, a pull-quote, and the paywall break placed for you.", "Opens in the editor"],
            ].map(([n, d, s]) => (
              <div key={n} className="min-w-0 flex-[1_1_250px] bg-ink p-[clamp(22px,2.2vw,30px)]">
                <h3 className="mb-3 text-[17.5px] font-semibold">{n}</h3>
                <p className="mb-[18px] text-[14.5px] leading-[1.55] text-[#A9BBD0]">{d}</p>
                <p className="m-0 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-sky"><span className="inline-block h-1.5 w-1.5 bg-sky" />{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCESS */}
      <section id="access" className={`${wrap} py-[clamp(64px,7vw,104px)]`}>
        <div className="flex flex-wrap gap-[clamp(32px,5vw,72px)]">
          <div className="min-w-0 flex-[1_1_380px]">
            <p className={`${eyebrow} mb-[18px]`}>Access</p>
            <h2 className={`${h2} mb-5`}>Twenty seats. By invitation.</h2>
            <p className="mb-4 text-[16.5px] leading-[1.6] text-mute">Straddle is in private beta with a small group of analysts, PMs and newsletter writers who publish regularly. Founding members shape what gets built next and keep the launch price.</p>
            <p className="m-0 text-[16.5px] leading-[1.6] text-mute"><span className="font-semibold text-ink">$47 per month</span> at launch. Nothing is charged during the beta, and founding members keep that price.</p>
          </div>
          <AccessForms />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line">
        <div className={`${wrap} flex flex-wrap items-center gap-x-8 gap-y-5 py-10`}>
          <span className="flex items-center gap-2.5">
            <span className="inline-block h-[11px] w-[11px] bg-ink" />
            <span className="font-mono text-[13px] font-medium tracking-[0.22em]">STRADDLE</span>
          </span>
          <span className="text-[13.5px] text-mute">Institutional content infrastructure for people who write about markets.</span>
          <span className="ml-auto flex flex-wrap gap-6 text-[13.5px]">
            <a href="#authored" className="text-mute no-underline hover:text-ink">Author-led</a>
            <a href="#access" className="text-mute no-underline hover:text-ink">Access</a>
            <a href="mailto:hello@straddle.business" className="text-mute no-underline hover:text-ink">hello@straddle.business</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
