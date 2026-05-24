import os, requests
from typing import Dict, Any

NOTION_TOKEN = os.getenv("NOTION_TOKEN", "")
NOTION_DB_RUMORS = os.getenv("NOTION_DB_RUMORS", "")
NOTION_DB_DEALS = os.getenv("NOTION_DB_DEALS", "")
NOTION_DB_FILINGS = os.getenv("NOTION_DB_FILINGS", "")
NOTION_DB_DEBT = os.getenv("NOTION_DB_DEBT", "")
NOTION_DB_COMMENTARY = os.getenv("NOTION_DB_COMMENTARY", "")
NOTION_DB_GENERIC = os.getenv("NOTION_DB_GENERIC", "")

HEADERS = {
    "Authorization": f"Bearer {NOTION_TOKEN}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json"
}

def _title(text: str): return {"title": [{"text": {"content": text[:2000]}}]}
def _rich(text: str): return {"rich_text": [{"text": {"content": (text or '')[:2000]}}]}
def _url(url: str):   return {"url": url or None}
def _num(n: float):   return {"number": n}
def _sel(name: str):  return {"select": {"name": name} if name else None}
def _date(iso: str):  return {"date": {"start": iso} if iso else None}

def _create_page(db: str, props: Dict[str, Any]):
    r = requests.post("https://api.notion.com/v1/pages", headers=HEADERS,
                      json={"parent": {"database_id": db}, "properties": props}, timeout=30)
    r.raise_for_status(); return r.json()

def save_rumor(item: Dict[str, Any]):
    db = NOTION_DB_RUMORS or NOTION_DB_GENERIC
    if not db: raise RuntimeError("Set NOTION_DB_RUMORS or NOTION_DB_GENERIC")
    props = {"Title": _title(item.get("title","Rumor")), "Confidence": _sel(item.get("confidence","Medium")),
             "Published": _date(item.get("published","")), "Source": _url(item.get("link","")),
             "Snippet": _rich(item.get("snippet","")), "Channel": _sel("Rumor")}
    return _create_page(db, props)

def save_deal(item: Dict[str, Any]):
    db = NOTION_DB_DEALS or NOTION_DB_GENERIC
    if not db: raise RuntimeError("Set NOTION_DB_DEALS or NOTION_DB_GENERIC")
    props = {"Title": _title(item.get("title","Deal")), "Date": _date(item.get("published","")),
             "Value": _rich(item.get("value","")), "Rationale": _rich(item.get("rationale","")),
             "Link": _url(item.get("link","")), "Channel": _sel("Deal")}
    return _create_page(db, props)

def save_filings_delta(item: Dict[str, Any]):
    db = NOTION_DB_FILINGS or NOTION_DB_GENERIC
    if not db: raise RuntimeError("Set NOTION_DB_FILINGS or NOTION_DB_GENERIC")
    props = {"Title": _title(item.get("title","Filing Δ")), "Risk Added": _num(float(item.get("risk_added",0))),
             "Risk Removed": _num(float(item.get("risk_removed",0))), "MD&A Added": _num(float(item.get("mda_added",0))),
             "MD&A Removed": _num(float(item.get("mda_removed",0))), "Channel": _sel("Filings")}
    return _create_page(db, props)

def save_debt_heatmap_row(item: Dict[str, Any]):
    db = NOTION_DB_DEBT or NOTION_DB_GENERIC
    if not db: raise RuntimeError("Set NOTION_DB_DEBT or NOTION_DB_GENERIC")
    props = {"Title": _title(f"Debt Bucket {item.get('bucket','')}"), "Bucket": _rich(str(item.get("bucket",""))),
             "Total": _num(float(item.get("total",0))), "Channel": _sel("Debt")}
    return _create_page(db, props)

def save_commentary_delta(item: Dict[str, Any]):
    db = NOTION_DB_COMMENTARY or NOTION_DB_GENERIC
    if not db: raise RuntimeError("Set NOTION_DB_COMMENTARY or NOTION_DB_GENERIC")
    diffs = item.get("diffs",{})
    props = {"Title": _title(item.get("title","Commentary Δ")), "Tone": _sel(item.get("tone","Neutral")),
             "Added": _rich(", ".join(diffs.get("added",[])[:15])),
             "Removed": _rich(", ".join(diffs.get("removed",[])[:15])),
             "Reworded": _rich(", ".join(diffs.get("reworded",[])[:15])), "Channel": _sel("Commentary")}
    return _create_page(db, props)
