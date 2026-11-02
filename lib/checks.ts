// Deterministic checks on the writer's own numbers. Code computes; no model involved.
import { findFigures } from "./analysis";
import type { Fact } from "./fred";

const num = (f: string): number | null => {
  if (/(bn|billion|mn|million|trn|trillion|bps?)\b/i.test(f)) return null;
  const m = f.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
};
const r1 = (x: number) => String(Math.round(x * 10) / 10);
const money = (x: number) => (x >= 1000 ? Math.round(x).toLocaleString("en-US") : String(Math.round(x * 100) / 100));

export function mathChecks(take: string, facts: Fact[]): string[] {
  const figs = findFigures(take);
  const pcts = figs.filter((f) => f.trim().endsWith("%")).map(num).filter((n): n is number => n !== null);
  const vals = Array.from(new Set(figs.filter((f) => !f.trim().endsWith("%")).map(num).filter((n): n is number => n !== null && n >= 1 && !(Number.isInteger(n) && n >= 1900 && n <= 2100))));
  const out: string[] = [];

  for (const p of pcts) {
    let best: { a: number; b: number; pct: number; err: number } | null = null;
    for (const a of vals) for (const b of vals) {
      if (a <= b) continue;
      const pct = (a / b - 1) * 100;
      const err = Math.abs(pct - p);
      if (!best || err < best.err) best = { a, b, pct, err };
    }
    if (!best || best.err > 4) continue;
    const pair = `${money(best.a)} against ${money(best.b)}`;
    out.push(best.err <= 0.6
      ? `Your ${r1(p)}% checks out: ${pair} is ${r1(best.pct)}% higher.`
      : `Your ${r1(p)}% does not match: ${pair} is ${r1(best.pct)}% higher.`);
  }

  for (const f of facts) {
    const near = vals.find((v) => Math.abs(v - f.latest) / f.latest <= 0.1);
    if (near !== undefined && Math.abs(near - f.latest) > 0.006) {
      const diff = (near / f.latest - 1) * 100;
      out.push(`You cite ${money(near)}. ${f.title} reads ${money(f.latest)} (${f.asOf}), so yours is ${r1(Math.abs(diff))}% ${diff > 0 ? "above" : "below"}. A spot price and a monthly average can differ.`);
    }
  }
  return out;
}
