from fastapi import FastAPI, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os

from scrapers.rumor_tracker import gather as gather_rumors
from scrapers.mna_deal_digest import gather as gather_deals
from scrapers.commentary_change import compare_docs
from scrapers.debt_maturity_heatmap import load_latest_filing_html, extract_debt_tables, summarize_heatmap_frames
from scrapers.sec_change_tracker import load_filing_html, compare_sections

app = FastAPI(title="Straddle API", version="0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/rumors")
def api_rumors(keywords: Optional[str]=Query(None), timeframe: int=30):
    kw = [k.strip() for k in (keywords or '').split(',') if k.strip()] or None
    return gather_rumors(timeframe_days=timeframe, keywords=kw)

@app.get("/api/deals")
def api_deals(sector: Optional[str]=Query(None), timeframe: int=60):
    return {"items": gather_deals(timeframe_days=timeframe, sector_filter=sector or "")}

@app.get("/api/commentary")
def api_commentary(prior_url: str, current_url: str):
    return compare_docs(prior_url, current_url)

@app.get("/api/debt")
def api_debt(ticker: str, filing: str="10-K"):
    html = load_latest_filing_html(ticker, filing_type=filing)
    dfs = extract_debt_tables(html)
    heat = summarize_heatmap_frames(dfs)
    return {"heatmap": heat.to_dict(orient="records")}

@app.get("/api/filings")
def api_filings(ticker: str, filing: str="10-Q"):
    cur = load_filing_html(ticker, filing_type=filing, index=0)
    prev = load_filing_html(ticker, filing_type=filing, index=1)
    return compare_sections(cur, prev)

# --------- Integrations: Notion & Airtable ----------
def _get_integrations(target: str):
    if target == "notion":
        from integrations.notion import save_rumor as r1, save_deal as r2, save_filings_delta as r3, save_debt_heatmap_row as r4, save_commentary_delta as r5
        return {"rumor": r1, "deal": r2, "filings": r3, "debt": r4, "commentary": r5}
    elif target == "airtable":
        from integrations.airtable import save_rumor as r1, save_deal as r2, save_filings_delta as r3, save_debt_heatmap_row as r4, save_commentary_delta as r5
        return {"rumor": r1, "deal": r2, "filings": r3, "debt": r4, "commentary": r5}
    else:
        raise RuntimeError("Set SAVE_TARGET env to 'notion' or 'airtable'")

@app.post("/api/save")
def api_save(channel: str = Query(...), payload: dict = Body(...)):
    fns = _get_integrations(os.getenv("SAVE_TARGET",""))
    if channel not in fns: return {"error":"unknown channel"}
    return {"ok": True, "res": fns[channel](payload)}

@app.post("/api/save/bulk")
def api_save_bulk(channel: str = Query(...), items: list = Body(...)):
    fns = _get_integrations(os.getenv("SAVE_TARGET",""))
    if channel not in fns: return {"error":"unknown channel"}
    out = [fns[channel](it) for it in items]
    return {"ok": True, "count": len(out)}
