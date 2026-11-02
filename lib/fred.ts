// Verified data for drafts. Facts are computed here in code from FRED observations;
// the model may quote them but never produces them.
// Needs FRED_API_KEY. Without it, drafts simply carry no data fact.

export type SeriesDef = { id: string; title: string; units: string; freq: string; rate?: boolean };

export const SERIES: SeriesDef[] = [
  { id: "PCOPPUSDM", title: "Global price of copper", units: "US dollars per metric ton", freq: "monthly" },
  { id: "DCOILWTICO", title: "WTI crude oil price", units: "US dollars per barrel", freq: "daily" },
  { id: "CPIAUCSL", title: "US consumer price index, all items", units: "index 1982-84 = 100", freq: "monthly" },
  { id: "PCEPILFE", title: "US core PCE price index", units: "index 2017 = 100", freq: "monthly" },
  { id: "FEDFUNDS", title: "Federal funds effective rate", units: "percent", freq: "monthly", rate: true },
  { id: "UNRATE", title: "US unemployment rate", units: "percent", freq: "monthly", rate: true },
  { id: "PAYEMS", title: "US nonfarm payrolls", units: "thousands of jobs", freq: "monthly" },
  { id: "DGS10", title: "10-year Treasury yield", units: "percent", freq: "daily", rate: true },
  { id: "DGS2", title: "2-year Treasury yield", units: "percent", freq: "daily", rate: true },
  { id: "T10Y2Y", title: "10-year minus 2-year Treasury spread", units: "percentage points", freq: "daily", rate: true },
  { id: "BAMLH0A0HYM2", title: "US high-yield credit spread", units: "percent", freq: "daily", rate: true },
  { id: "DTWEXBGS", title: "Broad US dollar index", units: "index Jan 2006 = 100", freq: "daily" },
  { id: "SP500", title: "S&P 500 index", units: "index", freq: "daily" },
  { id: "WALCL", title: "Federal Reserve total assets", units: "millions of US dollars", freq: "weekly" },
];
export const SERIES_IDS = new Set(SERIES.map((s) => s.id));

export type Fact = {
  id: string;
  title: string;
  asOf: string; // e.g. "Sep 2026"
  line: string; // what the model is given
  numbers: number[]; // every figure quoted in `line`, for checking the draft
  years: number[];
};

type Obs = { date: string; value: number };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtDate(d: string, freq: string): string {
  const [y, m, day] = d.split("-").map(Number);
  return freq === "monthly" ? `${MONTHS[m - 1]} ${y}` : `${day} ${MONTHS[m - 1]} ${y}`;
}
function fmt(v: number): string {
  if (Math.abs(v) >= 1000) return Math.round(v).toLocaleString("en-US");
  if (Math.abs(v) >= 100) return String(Math.round(v * 10) / 10);
  return String(Math.round(v * 100) / 100);
}
const shiftYears = (d: string, n: number) => `${Number(d.slice(0, 4)) + n}${d.slice(4)}`;

async function fetchSeries(def: SeriesDef, key: string): Promise<Obs[]> {
  const start = `${new Date().getUTCFullYear() - 7}-01-01`;
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${def.id}&api_key=${key}&file_type=json&observation_start=${start}`;
  const res = await fetch(url, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`FRED ${def.id} ${res.status}`);
  const body = (await res.json()) as { observations?: { date: string; value: string }[] };
  return (body.observations ?? [])
    .filter((o) => o.value !== "." && Number.isFinite(Number(o.value)))
    .map((o) => ({ date: o.date, value: Number(o.value) }));
}

export function computeFact(def: SeriesDef, obs: Obs[]): Fact | null {
  if (obs.length < 12) return null;
  const last = obs[obs.length - 1];
  const fiveBack = shiftYears(last.date, -5);
  const win = obs.filter((o) => o.date >= fiveBack);
  if (win.length < 12) return null;
  const hi = win.reduce((a, o) => (o.value > a.value ? o : a));
  const lo = win.reduce((a, o) => (o.value < a.value ? o : a));
  const rank = Math.round((win.filter((o) => o.value <= last.value).length / win.length) * 100);
  const yearAgo = shiftYears(last.date, -1);
  const prior = [...obs].reverse().find((o) => o.date <= yearAgo);

  const numbers = [last.value, hi.value, lo.value, rank];
  const parts = [`[${def.id}] ${def.title} (${def.units}, ${def.freq}). Latest: ${fmt(last.value)} (${fmtDate(last.date, def.freq)}).`];
  if (prior) {
    const diff = last.value - prior.value;
    const change = def.rate ? Math.abs(diff) : Math.abs(diff / prior.value) * 100;
    const word = diff >= 0 ? "up" : "down";
    const unit = def.rate ? " percentage points" : "%";
    numbers.push(prior.value, def.rate ? Math.abs(diff) : change);
    parts.push(`A year earlier: ${fmt(prior.value)} (${fmtDate(prior.date, def.freq)}), so ${word} ${fmt(change)}${unit}.`);
  }
  parts.push(`Five-year high: ${fmt(hi.value)} (${fmtDate(hi.date, def.freq)}). Five-year low: ${fmt(lo.value)} (${fmtDate(lo.date, def.freq)}).`);
  parts.push(`The latest reading is above ${rank}% of readings in the last five years.`);
  const years = Array.from(new Set([last, prior, hi, lo].filter((o): o is Obs => !!o).map((o) => Number(o.date.slice(0, 4)))));
  return { id: def.id, title: def.title, asOf: fmtDate(last.date, def.freq), line: parts.join(" "), numbers, years };
}

export async function getFacts(ids: string[]): Promise<Fact[]> {
  const key = process.env.FRED_API_KEY;
  if (!key) return [];
  const defs = ids.map((id) => SERIES.find((s) => s.id === id)).filter((d): d is SeriesDef => !!d).slice(0, 2);
  const out = await Promise.all(
    defs.map(async (d) => {
      try {
        return computeFact(d, await fetchSeries(d, key));
      } catch (e) {
        console.error("fred failed", e);
        return null;
      }
    }),
  );
  return out.filter((f): f is Fact => !!f);
}
