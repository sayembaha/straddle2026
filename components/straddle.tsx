import React, { useState, useEffect, useRef } from 'react';

// ============================================================
// STRADDLE — The Bloomberg Terminal for Finance Content
// ============================================================

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Inter+Tight:wght@300;400;500;600;700&display=swap');
`;

// ---------- Tickers (live-ish ticker tape) ----------
const TICKERS = [
  { sym: 'SPX',   px: '5,847.21', chg: '+0.42%', up: true },
  { sym: 'NDX',   px: '20,512.88', chg: '+0.81%', up: true },
  { sym: 'DXY',   px: '99.14',    chg: '-0.31%', up: false },
  { sym: 'UST10', px: '4.218',    chg: '-3.2bp', up: false },
  { sym: 'WTI',   px: '71.04',    chg: '+1.18%', up: true },
  { sym: 'XAU',   px: '3,412.50', chg: '+0.62%', up: true },
  { sym: 'BTC',   px: '94,221',   chg: '-1.04%', up: false },
  { sym: 'USDJPY',px: '156.82',   chg: '+0.18%', up: true },
  { sym: 'EURUSD',px: '1.0814',   chg: '+0.09%', up: true },
  { sym: 'VIX',   px: '14.22',    chg: '-2.41%', up: false },
  { sym: 'HG',    px: '4.382',    chg: '+0.74%', up: true },
  { sym: 'CL2',   px: '70.88',    chg: '+0.92%', up: true },
];

// ---------- Sample input/outputs ----------
const SAMPLE_INPUT = `NVIDIA Q3 FY26 print: Revenue $35.1B (+94% YoY), Data Center $30.8B (+112%), GM 75% (+220bps), guide Q4 $37.5B vs cons $37.0B. Hopper still ramping; Blackwell shipments commenced. Mgmt commentary: "demand significantly exceeds supply, expect this dynamic into CY26." Sovereign AI now ~15% of DC mix. CapEx digestion fears called "premature." Networking +20% QoQ.`;

const SAMPLE_OUTPUTS: Record<string, { title: string; body: string }> = {
  LinkedIn: {
    title: 'LinkedIn — Institutional Tone',
    body: `Three things mattered in NVIDIA's print, and the narrative missed all of them.

(1) Data Center revenue grew 112% YoY to $30.8B. That number is now larger than the entire 2022 semiconductor industry's data center spend. We are no longer in a cycle. We are in a re-architecture.

(2) Gross margins expanded 220bps to 75% — while Blackwell is still ramping. The bear case rested on margin compression from product transition. Management called it "transitory dilution." It didn't show up.

(3) Sovereign AI is now ~15% of DC mix. This is the line item that should reframe how you think about TAM. It is not enterprise capex. It is national industrial policy, and it does not respond to interest rates.

The market is pricing this as a hardware company in late cycle. The print suggests something closer to critical infrastructure in early innings.

Position accordingly.`
  },
  Newsletter: {
    title: 'Newsletter — Long-Form Draft',
    body: `## The Print That Reframes the Cycle

For two quarters, the consensus trade has been to fade NVIDIA into the Blackwell transition. The thesis was reasonable: every prior product cycle in semiconductors compressed margins, demand pulled forward, and the multiple de-rated. It was a clean setup.

It did not happen.

Q3 FY26 delivered $35.1B in revenue against consensus of $33.2B, with Data Center alone at $30.8B — a segment now larger than Intel's entire enterprise. Gross margin expanded to 75%, not contracted. Q4 guide of $37.5B sits 1.4% above the street, and management's qualitative tone — "demand significantly exceeds supply into CY26" — is the language of a supply-constrained monopoly, not a maturing cyclical.

**What the tape is missing**

The most important disclosure was buried. Sovereign AI is now approximately 15% of Data Center revenue. That is roughly $4.6B run-rate, from effectively zero eighteen months ago. This is not enterprise IT spend. This is the UAE, Saudi Arabia, France, Japan, and India building strategic compute the way they once built strategic petroleum reserves.

That demand curve is rate-insensitive. It is policy-driven. And it has a multi-year procurement cycle that has barely begun.

**The second-order trade**

If sovereign demand is structural, the bottleneck moves downstream — to power, to HBM capacity, to advanced packaging. The names that benefit are not the obvious ones. We'd flag the substrate suppliers, the liquid cooling specialists, and the regional utilities with stranded baseload capacity.

The hardware monopoly is not the trade anymore. The infrastructure adjacency is.`
  },
  Thread: {
    title: 'X/Twitter — 8-Post Thread',
    body: `1/ NVIDIA just printed $35.1B vs $33.2B cons. Data Center $30.8B, +112% YoY.

Everyone is reading this as a beat. They're missing the actual story.

A thread on what the tape got wrong 🧵

2/ The bear thesis was clean: Blackwell transition compresses margins, Hopper digestion creates an air pocket, multiple de-rates.

Gross margin went UP 220bps to 75%.

The transition is not happening. They're shipping both.

3/ But the line that matters is buried in the supplementals:

Sovereign AI = ~15% of Data Center.

From ~0% eighteen months ago.

4/ That's roughly $4.6B annualized, growing fast, from a customer base that doesn't exist in any analyst model.

UAE. Saudi. France. Japan. India.

5/ This demand is not enterprise capex. It does not respond to Fed policy. It responds to industrial policy.

It has a 5-10 year procurement horizon and it has barely started.

6/ The implication: the bottleneck is no longer GPU supply. It's everything downstream.

→ HBM (SK Hynix, Micron)
→ Advanced packaging (TSMC CoWoS)
→ Power & cooling (Vertiv, Eaton)
→ Substrates (Ibiden, Unimicron)

7/ The NVIDIA monopoly is priced in.

The infrastructure adjacency is not.

8/ Mgmt called CapEx digestion fears "premature."

Translation: you are early, not late.

End/`
  },
  Carousel: {
    title: 'Carousel Outline — 7 Slides',
    body: `SLIDE 1 — COVER
"The NVIDIA Print Nobody Read Correctly"
Subtext: Q3 FY26 in 7 slides

SLIDE 2 — THE NUMBERS
• Revenue: $35.1B (+94% YoY)
• Data Center: $30.8B (+112%)
• Gross Margin: 75% (+220bps)
• Q4 Guide: $37.5B (above cons)

SLIDE 3 — THE BEAR THESIS THAT BROKE
Going in: Blackwell transition would compress margins.
Reality: Margins expanded WHILE transitioning.

SLIDE 4 — THE LINE TO READ
Sovereign AI = 15% of Data Center mix.
~$4.6B annualized. Up from zero.

SLIDE 5 — WHY IT MATTERS
This demand does not respond to:
✗ Interest rates
✗ Earnings cycles
✗ Enterprise IT budgets

It responds to industrial policy.

SLIDE 6 — THE SECOND-ORDER TRADE
The GPU monopoly is priced.
The infrastructure stack is not.
→ HBM, packaging, power, cooling, substrates.

SLIDE 7 — CTA
"For institutional-grade market analysis,
subscribe to [Newsletter]"`
  },
  Contrarian: {
    title: 'Contrarian Take — The Other Side',
    body: `Everyone is anchoring to the 112% Data Center growth and the 75% gross margin. Here is the trade nobody wants to make:

NVIDIA's print was a top.

Not a fundamental top — a narrative top. And in this market, those are the same thing.

Three reasons:

(1) Sovereign AI as 15% of Data Center is being celebrated. It should be feared. Sovereign procurement is the late-cycle marker in every prior technology buildout — telecom 2000, solar 2011, EV 2022. When the buyer of last resort becomes a top-five customer, the marginal demand has already been priced.

(2) "Demand exceeds supply into CY26" is the same language Cisco used in Q3 2000. The line itself is not wrong. The market reaction to that line, at this multiple, has been historically lethal.

(3) The gross margin print is the tell. 75% gross margins in hardware do not persist. They invite competition, vertical integration by customers, and regulatory attention. Hyperscaler custom silicon (Trainium, TPU, MTIA) is not a threat in the model. It is a threat in the next twelve months of capex allocation decisions.

The fundamentals are spectacular. The setup is not. Those are different things, and confusing them is how cycles end.`
  },
  Substack: {
    title: 'Substack — Essayistic Long-Form',
    body: `# The Sovereign Trade Hiding in Plain Sight

*A note on what NVIDIA actually printed, and what nobody was willing to say about it.*

---

There is a particular flavor of market mistake I've come to recognize over the years. It happens when the consensus is technically right about the numbers but completely wrong about what the numbers mean. We had one this week.

NVIDIA reported Q3 FY26 on Wednesday. Revenue $35.1B, Data Center $30.8B, gross margins at 75%. The street called it a beat. The stock traded sideways. Everyone moved on.

They missed the only line that mattered.

## The disclosure nobody read aloud

Buried in the supplementals — not the earnings deck, not the prepared remarks, the *supplementals* — was a single data point: sovereign AI is now approximately 15% of Data Center revenue.

Eighteen months ago, that number was effectively zero.

Today it's roughly $4.6 billion in annualized run-rate, growing at a pace that the analyst models do not have a framework to extrapolate, coming from a customer base that does not appear in any historical comp.

The UAE. Saudi Arabia. France. Japan. India. Singapore.

> *"Demand significantly exceeds supply, and we expect this dynamic to persist through CY26."* — Jensen Huang, prepared remarks

You're meant to read that as guidance. Read it as geography.

## Why this changes the trade

For two years, the bear case on NVIDIA has rested on two pillars: enterprise capex digestion and hyperscaler custom silicon. Both are reasonable. Both are also irrelevant if the marginal buyer is no longer a private company.

Sovereign procurement does not respond to interest rates. It does not care about quarterly capex envelopes. It does not get displaced by Trainium. It operates on a five-to-ten year planning horizon, with budgets that have already been appropriated, in pursuit of objectives that have nothing to do with ROI.

This is the same demand curve that built the U.S. Strategic Petroleum Reserve. The same logic that drove French nuclear in the 1970s. The same instinct that's currently pulling rare earths inventory off the open market in Tokyo and Seoul.

It is industrial policy in semiconductor form.

## Where the trade goes next

If you accept that sovereign demand is structural, the second-order trade becomes more interesting than the first-order one. The GPU monopoly is priced. The bottleneck moves downstream.

I'd watch three things over the next two quarters:

1. **HBM allocation contracts** — SK Hynix and Micron sign on a different cadence than the equity market trades on
2. **CoWoS capacity at TSMC** — the actual chokepoint, and the one the sell-side underweights
3. **Substrate suppliers** — Ibiden, Unimicron, the names that haven't moved yet

The hardware monopoly is the obvious read. The infrastructure stack underneath it is the trade nobody is positioning for.

---

*If this was useful, the rest of the series — including the full sovereign AI procurement tracker — goes out to paid subscribers on Friday.*

*— B.*`
  },
  Beehiiv: {
    title: 'Beehiiv — Modular Newsletter',
    body: `📊 THE STRADDLE BRIEF — Friday Edition

*The NVIDIA print, decoded. Plus: three trades the desk is talking about this week.*

---

## TL;DR

→ NVIDIA beat ($35.1B vs $33.2B cons), but the story isn't the beat
→ Sovereign AI = 15% of Data Center, up from ~0% in 18 months
→ This is rate-insensitive, policy-driven demand. It changes the model
→ The trade is no longer GPU. It's the infrastructure stack underneath

*Read time: 4 minutes*

---

## 📈 THE NUMBERS

| Metric          | Q3 FY26   | YoY      | vs Cons   |
|-----------------|-----------|----------|-----------|
| Revenue         | $35.1B    | +94%     | +5.7%     |
| Data Center     | $30.8B    | +112%    | beat      |
| Gross Margin    | 75.0%     | +220bp   | +180bp    |
| Q4 Guide        | $37.5B    | —        | +1.4%     |

---

## 🎯 THE ONE THING

If you only remember one thing from this print:

**Sovereign AI is now ~15% of Data Center revenue.**

That's roughly $4.6B annualized. Eighteen months ago, the line item didn't exist.

The buyers are the UAE, Saudi Arabia, France, Japan, and India — and they're not buying because the unit economics work. They're buying because their governments decided compute is now a strategic asset, like a petroleum reserve.

That demand does not respond to:
- Fed policy
- Earnings cycles
- Enterprise IT budgets
- Hyperscaler capex digestion

It responds to industrial policy. And industrial policy operates on a five-to-ten year horizon that has barely started.

---

## 💡 THE SECOND-ORDER TRADE

The GPU monopoly is priced in. The infrastructure stack underneath it is not.

Three names the desk is watching:

→ **HBM suppliers** (SK Hynix, Micron) — capacity contracts re-strike Q1
→ **Advanced packaging** (TSMC CoWoS) — the actual chokepoint
→ **Substrates** (Ibiden, Unimicron) — haven't moved yet

---

## 📰 ALSO ON THE TAPE

**▸ 10-Year auction tailed 2.4bp.** Indirect bid hit 64.2%, lowest since Aug '23. Foreign CBs quietly stepping back from four consecutive auctions. End-of-cycle financing tell.

**▸ PBOC authorized RMB 800B in LGFV debt restructuring.** Bigger than QE in real terms. Quiet sovereign credit event nobody's covering.

**▸ Japanese life insurer FX hedge ratios at decade lows.** $3T of unhedged foreign assets. The pain trade is long JPY.

---

## 🎙️ FROM THE DESK

*"Sovereign procurement is the late-cycle marker in every prior tech buildout — telecom 2000, solar 2011, EV 2022. When the buyer of last resort becomes a top-five customer, the marginal demand has already been priced."*

— Anonymous PM, multi-strat

(The contrarian read. Worth holding both in your head.)

---

📩 **Forwarded this?** [Subscribe here] for the Friday brief.
🔗 **Share this issue:** [Twitter] · [LinkedIn] · [Copy link]
☕ **Sponsor:** This week's brief is supported by [Partner].

*See you Monday.*`
  }
};

const TONES = [
  'Goldman strategist',
  'Hedge fund PM',
  'McKinsey partner',
  'Bloomberg columnist',
  'Sell-side analyst',
  'Macro strategist',
];

const NARRATIVES = [
  {
    code: 'NAR-0418',
    title: 'Dollar weakness quietly refinances EM debt stack',
    detail: 'A 4% DXY drawdown YTD is doing more for sovereign EM refinancing than three cuts would. Watch BRL, IDR, ZAR curves.',
    conviction: 84,
    tag: 'MACRO',
    delta: '+12'
  },
  {
    code: 'NAR-0419',
    title: 'Sovereign AI procurement is the new strategic reserve',
    detail: 'UAE, Saudi, France, Japan compute spend is rate-insensitive and policy-driven. Five-year demand floor under hyperscaler hardware.',
    conviction: 91,
    tag: 'EQUITY',
    delta: '+8'
  },
  {
    code: 'NAR-0420',
    title: 'Japanese life insurer FX hedge ratios at decade lows',
    detail: 'Reduced hedging on $3T of foreign assets implies structural yen demand if rate diff compresses. The pain trade is long JPY.',
    conviction: 76,
    tag: 'FX',
    delta: '+5'
  },
  {
    code: 'NAR-0421',
    title: 'Investment grade spreads pricing zero default risk',
    detail: 'IG OAS at 78bp vs 25Y median 130bp. Credit not pricing the refinancing wall arriving Q2 2027.',
    conviction: 68,
    tag: 'CREDIT',
    delta: '-3'
  },
];

const LOGOS = ['Citadel', 'Bridgewater', 'Apollo', 'Millennium', 'Lone Pine', 'KKR', 'Tiger Global', 'Goldman'];

// ============================================================
// COMPONENTS
// ============================================================

const TickerTape: React.FC = () => (
  <div className="border-y border-[#1f1f1f] bg-black overflow-hidden">
    <div className="flex animate-ticker whitespace-nowrap py-2">
      {[...TICKERS, ...TICKERS, ...TICKERS].map((t, i) => (
        <div key={i} className="flex items-center gap-3 px-6 font-mono text-[11px]">
          <span className="text-[#666] tracking-wider">{t.sym}</span>
          <span className="text-[#e8e8e8]">{t.px}</span>
          <span className={t.up ? 'text-[#5ad19a]' : 'text-[#ff6b6b]'}>
            {t.up ? '▲' : '▼'} {t.chg}
          </span>
          <span className="text-[#222]">│</span>
        </div>
      ))}
    </div>
  </div>
);

const Nav: React.FC<{ onLaunch: () => void }> = ({ onLaunch }) => (
  <nav className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-black/90 backdrop-blur-xl">
    <div className="max-w-[1400px] mx-auto px-8 h-14 flex items-center justify-between">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#ffb547] animate-pulse-slow" />
          <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-[15px] font-semibold tracking-tight text-white">
            STRADDLE
          </span>
          <span className="ml-2 px-1.5 py-0.5 border border-[#2a2a2a] text-[9px] tracking-widest text-[#888] font-mono">TERMINAL</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[12px] text-[#888] font-mono tracking-wide">
          <a href="#features" className="hover:text-white transition">FEATURES</a>
          <a href="#narratives" className="hover:text-white transition">NARRATIVES</a>
          <a href="#workflow" className="hover:text-white transition">WORKFLOW</a>
          <a href="#pricing" className="hover:text-white transition">PRICING</a>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button className="text-[12px] text-[#888] hover:text-white font-mono tracking-wide transition whitespace-nowrap">SIGN IN</button>
        <button
          onClick={onLaunch}
          style={{ backgroundColor: '#ffb547', color: '#000' }}
          className="group relative px-4 py-2 text-[12px] font-mono font-semibold tracking-wide hover:brightness-110 transition-all whitespace-nowrap"
        >
          GET EARLY ACCESS
          <span className="ml-2 group-hover:translate-x-0.5 inline-block transition-transform">→</span>
        </button>
      </div>
    </div>
  </nav>
);

const Hero: React.FC<{ onLaunch: () => void }> = ({ onLaunch }) => (
  <section className="relative overflow-hidden border-b border-[#1a1a1a]">
    {/* Grid background — subtle, fades from center */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 85%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 85%)',
      }}
    />
    {/* Amber gradient glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#ffb547] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />

    <div className="relative max-w-[1400px] mx-auto px-8 pt-20 pb-24 grid grid-cols-12 gap-8">
      {/* Left: copy */}
      <div className="col-span-12 lg:col-span-6 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-px w-8 bg-[#ffb547]" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-[#ffb547]">EST. 2026 · NEW YORK</span>
        </div>

        <h1
          style={{ fontFamily: 'Fraunces, serif', fontWeight: 400 }}
          className="text-[58px] leading-[1.02] tracking-[-0.02em] text-white mb-6"
        >
          The <span style={{ fontStyle: 'italic', fontWeight: 300 }} className="text-[#ffb547]">Bloomberg Terminal</span> for finance<br />content creation.
        </h1>

        <p className="text-[16px] leading-[1.6] text-[#999] max-w-[480px] mb-8" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
          Turn earnings prints, macro flow, and rough thoughts into institutional-grade thought leadership in seconds. Built for the side of the desk that writes.
        </p>

        <div className="flex items-center gap-3 mb-12">
          <button
            onClick={onLaunch}
            style={{ backgroundColor: '#ffb547', color: '#000' }}
            className="group px-5 py-3 text-[13px] font-mono font-semibold tracking-wide hover:brightness-110 transition"
          >
            GET EARLY ACCESS
            <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
          </button>
          <button
            onClick={onLaunch}
            className="px-5 py-3 border border-[#2a2a2a] text-white text-[13px] font-mono tracking-wide hover:border-[#444] hover:bg-[#0a0a0a] transition"
          >
            SEE SAMPLE OUTPUTS
          </button>
        </div>

        <div className="flex items-center gap-6 text-[11px] font-mono text-[#666]">
          <div>
            <span className="text-white text-[18px] font-semibold block" style={{ fontFamily: 'JetBrains Mono' }}>2,400+</span>
            <span className="tracking-wide">ANALYSTS WAITLISTED</span>
          </div>
          <div className="h-8 w-px bg-[#222]" />
          <div>
            <span className="text-white text-[18px] font-semibold block" style={{ fontFamily: 'JetBrains Mono' }}>14</span>
            <span className="tracking-wide">SOVEREIGN FUNDS</span>
          </div>
          <div className="h-8 w-px bg-[#222]" />
          <div>
            <span className="text-white text-[18px] font-semibold block" style={{ fontFamily: 'JetBrains Mono' }}>$3.2T</span>
            <span className="tracking-wide">AUM REPRESENTED</span>
          </div>
        </div>
      </div>

      {/* Right: terminal preview */}
      <div className="col-span-12 lg:col-span-6 relative">
        <TerminalPreview />
      </div>
    </div>
  </section>
);

const TerminalPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('LinkedIn');
  const [typed, setTyped] = useState('');
  const full = SAMPLE_OUTPUTS[activeTab].body.slice(0, 380);

  useEffect(() => {
    setTyped('');
    let i = 0;
    const interval = setInterval(() => {
      i += 3;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="relative">
      {/* Subtle glow */}
      <div className="absolute -inset-4 bg-[#ffb547] opacity-[0.04] blur-2xl" />

      <div className="relative bg-[#0a0a0a] border border-[#222] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)]">
        {/* Window chrome */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1a1a1a] bg-[#070707]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1f1f1f]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#1f1f1f]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#1f1f1f]" />
          </div>
          <div className="font-mono text-[10px] text-[#555] tracking-widest">STRADDLE.GEN · LIVE</div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#5ad19a] animate-pulse" />
            <span className="font-mono text-[9px] text-[#5ad19a] tracking-wider">CONNECTED</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1a1a1a] bg-[#080808] overflow-x-auto scrollbar-thin">
          {Object.keys(SAMPLE_OUTPUTS).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2.5 text-[10px] font-mono tracking-wide border-r border-[#1a1a1a] transition whitespace-nowrap ${
                activeTab === tab
                  ? 'text-[#ffb547] bg-black border-b-2 border-b-[#ffb547] -mb-px'
                  : 'text-[#666] hover:text-white'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 h-[380px] overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] text-[#666] tracking-wider">
              {SAMPLE_OUTPUTS[activeTab].title.toUpperCase()}
            </span>
            <div className="flex gap-1.5">
              <span className="font-mono text-[9px] text-[#444] tracking-wider px-2 py-0.5 border border-[#222]">⌘C COPY</span>
              <span className="font-mono text-[9px] text-[#444] tracking-wider px-2 py-0.5 border border-[#222]">⌘R REGEN</span>
            </div>
          </div>

          <div
            className="text-[13px] leading-[1.7] text-[#d8d8d8] whitespace-pre-wrap"
            style={{ fontFamily: 'Inter Tight, sans-serif' }}
          >
            {typed}
            <span className="inline-block w-2 h-4 bg-[#ffb547] ml-0.5 animate-blink align-middle" />
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#1a1a1a] bg-[#070707] flex items-center justify-between font-mono text-[10px] text-[#555]">
          <span>TONE: GOLDMAN STRATEGIST</span>
          <span>TOKENS: 412 / 4096</span>
          <span>LATENCY: 1.2s</span>
        </div>
      </div>
    </div>
  );
};

const SocialProof: React.FC = () => (
  <section className="border-b border-[#1a1a1a] py-12 bg-[#040404]">
    <div className="max-w-[1400px] mx-auto px-8">
      <div className="text-center mb-8">
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#666]">
          TRUSTED BY ANALYSTS AND PMs AT
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-x-8 gap-y-6 items-center">
        {LOGOS.map(logo => (
          <div
            key={logo}
            className="text-center font-mono text-[13px] text-[#444] hover:text-[#888] transition tracking-wider"
            style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 500 }}
          >
            {logo}
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Features: React.FC = () => {
  const features = [
    {
      code: 'F-001',
      name: 'LinkedIn Writer',
      desc: 'Transform raw market notes into institutional-tone posts. No emoji. No hooks that smell of growth-hacker.',
      stat: '∅ AI-isms'
    },
    {
      code: 'F-002',
      name: 'Earnings → Post Engine',
      desc: 'Paste the transcript. Get three takes: the consensus read, the buried lede, the contrarian frame.',
      stat: '< 8s'
    },
    {
      code: 'F-003',
      name: 'Macro Narrative Generator',
      desc: 'Surface second-order narratives. Cross-asset implications. The trades nobody is writing about yet.',
      stat: '4 timeframes'
    },
    {
      code: 'F-004',
      name: 'Institutional Tone Rewriter',
      desc: 'Take a draft. Strip the LinkedIn voice. Restore the desk voice. Calibrated to six house styles.',
      stat: '6 tones'
    },
    {
      code: 'F-005',
      name: 'Substack & Beehiiv Native',
      desc: 'Platform-aware formatting. Substack gets the essayistic long-form. Beehiiv gets the modular TL;DR, tables, and sponsor slots.',
      stat: '2 platforms'
    },
    {
      code: 'F-006',
      name: 'Contrarian Insight Generator',
      desc: 'Steelman the other side of your own thesis. The trade that breaks your book. Find it first.',
      stat: '2-3 angles'
    },
    {
      code: 'F-007',
      name: 'Multi-Channel Distribution',
      desc: 'One input. Seven outputs. LinkedIn, X, Substack, Beehiiv, carousel, newsletter, contrarian — calibrated per channel.',
      stat: '7 channels'
    },
  ];

  return (
    <section id="features" className="border-b border-[#1a1a1a] py-24">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid grid-cols-12 gap-8 mb-16">
          <div className="col-span-12 lg:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-[#ffb547]" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#ffb547]">02 · CAPABILITIES</span>
            </div>
            <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-[44px] leading-[1.05] tracking-[-0.02em] text-white">
              Seven engines. One <span style={{ fontStyle: 'italic' }} className="text-[#ffb547]">desk-grade</span> output.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 flex items-end">
            <p className="text-[15px] leading-[1.6] text-[#999]" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
              Each module is tuned on institutional research, sell-side notes, and the writing of analysts who've sat both buy-side and sell-side. The output reads like it came from a desk, not a content tool.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a] border border-[#1a1a1a]">
          {features.map((f) => (
            <div
              key={f.code}
              className="group bg-black p-7 hover:bg-[#070707] transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="font-mono text-[10px] text-[#444] tracking-widest">{f.code}</span>
                <span className="font-mono text-[10px] text-[#ffb547] tracking-wider">{f.stat}</span>
              </div>
              <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-[22px] text-white mb-3 leading-tight">
                {f.name}
              </h3>
              <p className="text-[13px] leading-[1.6] text-[#888]" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
                {f.desc}
              </p>
              <div className="mt-6 flex items-center gap-2 text-[#444] group-hover:text-[#ffb547] transition">
                <span className="font-mono text-[10px] tracking-widest">EXPLORE</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Workflow: React.FC = () => (
  <section id="workflow" className="border-b border-[#1a1a1a] py-24 bg-[#040404]">
    <div className="max-w-[1400px] mx-auto px-8">
      <div className="flex items-center gap-2 mb-4 justify-center">
        <div className="h-px w-8 bg-[#ffb547]" />
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#ffb547]">03 · WORKFLOW</span>
        <div className="h-px w-8 bg-[#ffb547]" />
      </div>
      <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-[44px] leading-[1.05] tracking-[-0.02em] text-white text-center mb-20">
        From the wire to the post in <span style={{ fontStyle: 'italic' }} className="text-[#ffb547]">three steps</span>.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1a1a1a] border border-[#1a1a1a]">
        {[
          {
            n: '01',
            label: 'INGEST',
            title: 'Paste anything',
            body: 'Earnings transcript. 10-K excerpt. A Bloomberg headline. Your own notes from the morning call. The fuller the input, the sharper the angle.',
          },
          {
            n: '02',
            label: 'ANALYZE',
            title: 'AI extracts the narrative',
            body: 'Numbers. The buried lede. Second-order implications. Cross-asset reads. What consensus is missing. What contrarian capital sees.',
          },
          {
            n: '03',
            label: 'GENERATE',
            title: 'Publish-ready output',
            body: 'LinkedIn post. Newsletter draft. X thread. Carousel outline. Choose the channel, choose the tone, copy it out.',
          },
        ].map((step) => (
          <div key={step.n} className="bg-black p-10 relative">
            <div className="flex items-start justify-between mb-8">
              <span style={{ fontFamily: 'Fraunces, serif' }} className="text-[64px] leading-none text-[#1a1a1a] font-light">
                {step.n}
              </span>
              <span className="font-mono text-[10px] text-[#ffb547] tracking-widest mt-2">{step.label}</span>
            </div>
            <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-[24px] text-white mb-4">
              {step.title}
            </h3>
            <p className="text-[13px] leading-[1.7] text-[#888]" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const NarrativeEngine: React.FC = () => (
  <section id="narratives" className="border-b border-[#1a1a1a] py-24">
    <div className="max-w-[1400px] mx-auto px-8">
      <div className="grid grid-cols-12 gap-8 mb-12">
        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-[#ffb547]" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-[#ffb547]">04 · NARRATIVE ENGINE</span>
          </div>
          <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-[44px] leading-[1.05] tracking-[-0.02em] text-white mb-4">
            Hidden narratives, <span style={{ fontStyle: 'italic' }} className="text-[#ffb547]">surfaced</span>.
          </h2>
          <p className="text-[15px] leading-[1.6] text-[#999] max-w-[600px]" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
            Continuously scanned. Cross-asset. Second-order. The trades the desk is talking about before the street writes them up.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-3 lg:col-start-10 flex flex-col items-end justify-end gap-2 font-mono text-[10px] text-[#666]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#5ad19a] animate-pulse" />
            <span>LIVE · UPDATED 14s AGO</span>
          </div>
          <div>SCANNING 412 SOURCES</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {NARRATIVES.map(n => (
          <div
            key={n.code}
            className="group bg-[#0a0a0a] border border-[#1a1a1a] p-6 hover:border-[#333] transition cursor-pointer relative overflow-hidden"
          >
            {/* Hover accent */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#ffb547] scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-[#444] tracking-widest">{n.code}</span>
                <span className="font-mono text-[9px] tracking-widest px-1.5 py-0.5 border border-[#2a2a2a] text-[#888]">{n.tag}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#5ad19a]">
                <span>▲</span>
                <span>{n.delta} conv.</span>
              </div>
            </div>

            <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-[20px] leading-tight text-white mb-3">
              {n.title}
            </h3>
            <p className="text-[13px] leading-[1.6] text-[#888] mb-5" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
              {n.detail}
            </p>

            {/* Conviction bar */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-[#666] tracking-wider">CONVICTION</span>
              <div className="flex-1 h-[2px] bg-[#1a1a1a] overflow-hidden">
                <div
                  className="h-full bg-[#ffb547]"
                  style={{ width: `${n.conviction}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-[#ffb547] tracking-wider">{n.conviction}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const SampleOutputs: React.FC = () => (
  <section className="border-b border-[#1a1a1a] py-24 bg-[#040404]">
    <div className="max-w-[1400px] mx-auto px-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px w-8 bg-[#ffb547]" />
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#ffb547]">05 · SPECIMENS</span>
      </div>
      <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-[44px] leading-[1.05] tracking-[-0.02em] text-white mb-12">
        Output samples. <span style={{ fontStyle: 'italic' }} className="text-[#ffb547]">No edits.</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          {
            type: 'LINKEDIN POST',
            tone: 'Hedge Fund PM',
            body: 'The 10-year auction tailed 2.4bp. Indirect bid 64.2%, the lowest since Aug 2023.\n\nThis is not a story about supply. It is a story about who isn\'t showing up.\n\nForeign central banks have quietly reduced their auction participation for four consecutive months. The Fed\'s SOMA is shrinking. Primary dealers are absorbing the residual.\n\nThis is what end-of-cycle financing looks like — not in the curve, but in the auction tape.',
          },
          {
            type: 'SUBSTACK · LEDE',
            tone: 'Bloomberg Columnist',
            body: 'There is a tradition in markets of ignoring the thing that matters most because it does not move. The Saudi riyal peg is the current example.\n\nFor 38 years, USDSAR has held at 3.75. It is the longest-running G20 currency peg. It is also the structural foundation of the petrodollar system — and for the first time in two decades, the fiscal arithmetic underneath it is breaking.\n\n*A note for paid subscribers on what that breakage actually looks like, and the three trades that express it cleanly.*',
          },
          {
            type: 'BEEHIIV · TL;DR',
            tone: 'Macro Strategist',
            body: '📊 THE WEEK IN MACRO\n\n→ PBOC authorized RMB 800B in LGFV restructuring — bigger than QE in real terms\n→ 10Y auction tailed 2.4bp, indirect bid at 2-year lows\n→ Japanese lifer hedge ratios at decade lows; long-JPY pain trade setting up\n\n*Read time: 4 min*\n\n---\n\n## 🎯 THE ONE THING\n\nThe Chinese stimulus nobody is pricing is not the rate cut. It is the quiet $110B sovereign credit event hiding inside the LGFV swap mechanism...',
          },
        ].map((s, i) => (
          <div key={i} className="bg-black border border-[#1a1a1a] p-6 group hover:border-[#333] transition">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1a1a1a]">
              <span className="font-mono text-[10px] text-[#ffb547] tracking-widest">{s.type}</span>
              <span className="font-mono text-[10px] text-[#666] tracking-wider">{s.tone}</span>
            </div>
            <p className="text-[13px] leading-[1.7] text-[#d8d8d8] whitespace-pre-wrap" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Pricing: React.FC = () => {
  const tiers = [
    {
      name: 'STARTER',
      price: '19',
      tag: 'INDIVIDUAL',
      desc: 'For analysts building a personal brand.',
      features: ['50 generations / month', 'All 6 content formats', '3 tone presets', 'Standard latency', 'Email support'],
      cta: 'BEGIN',
    },
    {
      name: 'PRO',
      price: '49',
      tag: 'MOST SELECTED',
      desc: 'For newsletter operators and senior contributors.',
      features: ['500 generations / month', 'All formats + custom', '6 tone presets + custom', 'Priority latency', 'Narrative Engine access', 'Saved frameworks'],
      cta: 'BEGIN',
      featured: true,
    },
    {
      name: 'DESK',
      price: '199',
      tag: 'TEAMS · INSTITUTIONS',
      desc: 'For research desks and content teams.',
      features: ['Unlimited generations', 'Team workspaces', 'Custom tone training', 'API access', 'Dedicated support', 'SSO + audit log'],
      cta: 'CONTACT',
    },
  ];

  return (
    <section id="pricing" className="border-b border-[#1a1a1a] py-24">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="text-center mb-16">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <div className="h-px w-8 bg-[#ffb547]" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-[#ffb547]">06 · ACCESS</span>
            <div className="h-px w-8 bg-[#ffb547]" />
          </div>
          <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-[44px] leading-[1.05] tracking-[-0.02em] text-white">
            Three tiers. <span style={{ fontStyle: 'italic' }} className="text-[#ffb547]">No middleware.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#1a1a1a] border border-[#1a1a1a]">
          {tiers.map(t => (
            <div
              key={t.name}
              className={`p-8 relative ${t.featured ? 'bg-[#0a0a0a]' : 'bg-black'}`}
            >
              {t.featured && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#ffb547]" />
              )}
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[11px] tracking-[0.2em] text-white">{t.name}</span>
                <span className={`font-mono text-[9px] tracking-widest px-2 py-1 border ${t.featured ? 'border-[#ffb547] text-[#ffb547]' : 'border-[#2a2a2a] text-[#666]'}`}>
                  {t.tag}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <span style={{ fontFamily: 'Fraunces, serif' }} className="text-[64px] leading-none text-white font-light">
                  ${t.price}
                </span>
                <span className="font-mono text-[11px] text-[#666] tracking-wider">/ MONTH</span>
              </div>

              <p className="text-[13px] text-[#888] mb-8 leading-[1.5]" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
                {t.desc}
              </p>

              <button
                style={t.featured ? { backgroundColor: '#ffb547', color: '#000' } : undefined}
                className={`w-full py-3 text-[12px] font-mono tracking-wider mb-8 transition ${
                  t.featured
                    ? 'hover:brightness-110'
                    : 'border border-[#2a2a2a] text-white hover:border-[#444] hover:bg-[#0a0a0a]'
                }`}>
                {t.cta} →
              </button>

              <div className="space-y-3">
                {t.features.map(f => (
                  <div key={f} className="flex items-start gap-3">
                    <span className="text-[#ffb547] text-[10px] mt-1 font-mono">▸</span>
                    <span className="text-[13px] text-[#bbb]" style={{ fontFamily: 'Inter Tight, sans-serif' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-black py-16">
    <div className="max-w-[1400px] mx-auto px-8">
      <div className="grid grid-cols-12 gap-8 mb-16">
        <div className="col-span-12 md:col-span-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-[#ffb547]" />
            <span style={{ fontFamily: 'JetBrains Mono' }} className="text-[15px] font-semibold tracking-tight text-white">
              STRADDLE
            </span>
          </div>
          <p className="text-[13px] text-[#666] leading-[1.6] max-w-[280px]" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
            Institutional content infrastructure for finance professionals. Built in New York.
          </p>
        </div>

        {[
          { h: 'PRODUCT', items: ['Generate', 'Narrative Engine', 'Tone Library', 'Templates', 'API'] },
          { h: 'COMPANY', items: ['About', 'Manifesto', 'Careers', 'Press', 'Contact'] },
          { h: 'RESOURCES', items: ['Documentation', 'Sample Library', 'Tone Guide', 'Status', 'Changelog'] },
        ].map(col => (
          <div key={col.h} className="col-span-6 md:col-span-2">
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-[#666] mb-4">{col.h}</h4>
            <ul className="space-y-2.5">
              {col.items.map(item => (
                <li key={item}>
                  <a href="#" className="text-[13px] text-[#aaa] hover:text-white transition" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-12 md:col-span-2">
          <h4 className="font-mono text-[10px] tracking-[0.2em] text-[#666] mb-4">DESK</h4>
          <p className="text-[13px] text-[#aaa] leading-[1.6]" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
            32 Wall Street<br />
            Floor 14<br />
            New York, NY 10005
          </p>
        </div>
      </div>

      <div className="border-t border-[#1a1a1a] pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="font-mono text-[10px] text-[#444] tracking-wider">
          © 2026 STRADDLE LABS, INC. · ALL RIGHTS RESERVED
        </div>
        <div className="flex items-center gap-6 font-mono text-[10px] text-[#444] tracking-wider">
          <a href="#" className="hover:text-white transition">PRIVACY</a>
          <a href="#" className="hover:text-white transition">TERMS</a>
          <a href="#" className="hover:text-white transition">SECURITY</a>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#5ad19a] animate-pulse" />
            <span>ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

// ============================================================
// THE GENERATE APP (live interactive demo)
// ============================================================

const GenerateApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [input, setInput] = useState(SAMPLE_INPUT);
  const [activeTab, setActiveTab] = useState('LinkedIn');
  const [tone, setTone] = useState(TONES[0]);
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState(SAMPLE_OUTPUTS.LinkedIn.body);
  const [typed, setTyped] = useState(SAMPLE_OUTPUTS.LinkedIn.body);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTyped('');
    setOutput('');
    setTimeout(() => {
      const newOut = SAMPLE_OUTPUTS[activeTab].body;
      setOutput(newOut);
      setGenerating(false);

      // typewriter
      let i = 0;
      const interval = setInterval(() => {
        i += 6;
        setTyped(newOut.slice(0, i));
        if (i >= newOut.length) {
          setTyped(newOut);
          clearInterval(interval);
        }
      }, 15);
    }, 900);
  };

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line
  }, [activeTab]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
      {/* Top bar */}
      <div className="border-b border-[#1a1a1a] bg-black h-12 flex items-center px-6 justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#ffb547] animate-pulse-slow" />
            <span style={{ fontFamily: 'JetBrains Mono' }} className="text-[13px] font-semibold tracking-tight">
              STRADDLE
            </span>
            <span className="font-mono text-[9px] text-[#666] tracking-widest ml-2">/ GENERATE</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 font-mono text-[10px] text-[#5ad19a]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#5ad19a] animate-pulse" />
            CONNECTED · GPT-5 TURBO
          </div>
        </div>
        <button
          onClick={onClose}
          className="font-mono text-[11px] text-[#888] hover:text-white tracking-wider transition"
        >
          ✕ EXIT TERMINAL
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 border-r border-[#1a1a1a] bg-[#040404] py-4 hidden lg:block">
          <div className="px-4 mb-6">
            <div className="font-mono text-[9px] text-[#555] tracking-widest mb-2">WORKSPACE</div>
            <div className="text-[13px] text-white">Personal Desk</div>
          </div>

          {[
            { icon: '◧', name: 'Dashboard' },
            { icon: '▸', name: 'Generate', active: true },
            { icon: '◌', name: 'Saved Drafts', count: 12 },
            { icon: '◇', name: 'Narratives', count: 4 },
            { icon: '▢', name: 'Templates' },
            { icon: '⚙', name: 'Settings' },
          ].map(item => (
            <button
              key={item.name}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-[13px] transition ${
                item.active
                  ? 'bg-[#0a0a0a] text-white border-l-2 border-[#ffb547] -ml-px'
                  : 'text-[#888] hover:bg-[#080808] hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="font-mono text-[#ffb547]">{item.icon}</span>
                {item.name}
              </span>
              {item.count && <span className="font-mono text-[10px] text-[#555]">{item.count}</span>}
            </button>
          ))}

          <div className="px-4 mt-8 pt-6 border-t border-[#1a1a1a]">
            <div className="font-mono text-[9px] text-[#555] tracking-widest mb-3">USAGE</div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span style={{ fontFamily: 'JetBrains Mono' }} className="text-[20px] text-white">147</span>
              <span className="text-[11px] text-[#666]">/ 500</span>
            </div>
            <div className="h-[3px] bg-[#1a1a1a] overflow-hidden">
              <div className="h-full bg-[#ffb547]" style={{ width: '29%' }} />
            </div>
            <div className="font-mono text-[9px] text-[#555] mt-2 tracking-wider">RESETS IN 18 DAYS</div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex overflow-hidden">
          {/* LEFT — input */}
          <div className="flex-1 border-r border-[#1a1a1a] flex flex-col">
            <div className="px-6 py-3 border-b border-[#1a1a1a] flex items-center justify-between bg-[#040404]">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-[#ffb547] tracking-widest">INPUT</span>
                <span className="font-mono text-[10px] text-[#555] tracking-wider">PASTE OR TYPE</span>
              </div>
              <div className="font-mono text-[10px] text-[#555] tracking-wider">
                {input.length} CHARS · ~{Math.ceil(input.split(' ').length / 0.75)} TOKENS
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-black text-[14px] text-[#e8e8e8] p-6 resize-none outline-none leading-[1.7]"
              placeholder="Paste an earnings transcript, market note, SEC filing, or rough thoughts..."
              style={{ fontFamily: 'Inter Tight, sans-serif' }}
            />
            <div className="px-6 py-4 border-t border-[#1a1a1a] bg-[#040404] flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1 overflow-x-auto">
                <span className="font-mono text-[10px] text-[#555] tracking-widest whitespace-nowrap">TONE:</span>
                {TONES.map(t => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-2.5 py-1 font-mono text-[10px] tracking-wide whitespace-nowrap transition border ${
                      tone === t
                        ? 'border-[#ffb547] text-[#ffb547] bg-[#ffb547]/[0.05]'
                        : 'border-[#1a1a1a] text-[#666] hover:border-[#333] hover:text-white'
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating}
                style={{ backgroundColor: '#ffb547', color: '#000' }}
                className="px-5 py-2 text-[11px] font-mono font-semibold tracking-wider hover:brightness-110 transition disabled:opacity-60"
              >
                {generating ? 'GENERATING...' : 'GENERATE ⌘↵'}
              </button>
            </div>
          </div>

          {/* RIGHT — output */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-[#1a1a1a] bg-[#040404] overflow-x-auto scrollbar-thin">
              {Object.keys(SAMPLE_OUTPUTS).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-3 text-[10px] font-mono tracking-wide border-r border-[#1a1a1a] transition whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-[#ffb547] bg-black border-b-2 border-b-[#ffb547] -mb-px'
                      : 'text-[#666] hover:text-white'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Output content */}
            <div className="flex-1 overflow-y-auto p-6 bg-black">
              {generating ? (
                <div className="space-y-3">
                  {[100, 92, 78, 95, 65, 88, 70].map((w, i) => (
                    <div
                      key={i}
                      className="h-3 bg-[#0f0f0f] rounded animate-pulse"
                      style={{ width: `${w}%`, animationDelay: `${i * 80}ms` }}
                    />
                  ))}
                  <div className="font-mono text-[10px] text-[#ffb547] tracking-widest mt-6 animate-pulse">
                    ▸ ANALYZING NARRATIVES · EXTRACTING SECOND-ORDER IMPLICATIONS · CALIBRATING TONE...
                  </div>
                </div>
              ) : (
                <div className="text-[14px] leading-[1.75] text-[#e8e8e8] whitespace-pre-wrap" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
                  {typed}
                  {typed.length < output.length && (
                    <span className="inline-block w-2 h-4 bg-[#ffb547] ml-0.5 animate-blink align-middle" />
                  )}
                </div>
              )}
            </div>

            {/* Action bar */}
            <div className="px-6 py-3 border-t border-[#1a1a1a] bg-[#040404] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 border border-[#1a1a1a] hover:border-[#333] font-mono text-[10px] text-[#aaa] tracking-wider transition flex items-center gap-2"
                >
                  {copied ? <><span className="text-[#5ad19a]">✓</span> COPIED</> : <><span>⌘C</span> COPY</>}
                </button>
                <button
                  onClick={handleGenerate}
                  className="px-3 py-1.5 border border-[#1a1a1a] hover:border-[#333] font-mono text-[10px] text-[#aaa] tracking-wider transition"
                >
                  ⌘R REGENERATE
                </button>
                <button className="px-3 py-1.5 border border-[#1a1a1a] hover:border-[#333] font-mono text-[10px] text-[#aaa] tracking-wider transition">
                  ⌘S SAVE
                </button>
                <button className="px-3 py-1.5 border border-[#1a1a1a] hover:border-[#333] font-mono text-[10px] text-[#aaa] tracking-wider transition">
                  ↗ SHORTEN
                </button>
                <button className="px-3 py-1.5 border border-[#1a1a1a] hover:border-[#333] font-mono text-[10px] text-[#aaa] tracking-wider transition">
                  ↗ EXPAND
                </button>
              </div>
              <div className="font-mono text-[10px] text-[#555] tracking-wider">
                {output.length > 0 && `${output.split(' ').length} WORDS · ${output.length} CHARS`}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// ============================================================
// PAGE
// ============================================================

const Straddle: React.FC = () => {
  const [showApp, setShowApp] = useState(false);

  return (
    <div className="bg-black text-white min-h-screen" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
      <style>{`
        ${FONT_IMPORT}
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-ticker { animation: ticker 80s linear infinite; }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink { animation: blink 1s steps(1) infinite; }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .animate-pulse-slow { animation: pulse-slow 2.5s ease-in-out infinite; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #1a1a1a; }
        ::-webkit-scrollbar-thumb:hover { background: #2a2a2a; }
      `}</style>

      <Nav onLaunch={() => setShowApp(true)} />
      <TickerTape />
      <Hero onLaunch={() => setShowApp(true)} />
      <SocialProof />
      <Features />
      <Workflow />
      <NarrativeEngine />
      <SampleOutputs />
      <Pricing />
      <Footer />

      {showApp && <GenerateApp onClose={() => setShowApp(false)} />}
    </div>
  );
};

export default Straddle;
