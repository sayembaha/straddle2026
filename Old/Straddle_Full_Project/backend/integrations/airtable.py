import os, requests
from typing import Dict, Any

AIRTABLE_TOKEN = os.getenv("AIRTABLE_TOKEN","")
AIRTABLE_BASE_ID = os.getenv("AIRTABLE_BASE_ID","")
TABLE_RUMORS = os.getenv("AIRTABLE_TABLE_RUMORS","Rumors")
TABLE_DEALS = os.getenv("AIRTABLE_TABLE_DEALS","Deals")
TABLE_FILINGS = os.getenv("AIRTABLE_TABLE_FILINGS","Filings")
TABLE_DEBT = os.getenv("AIRTABLE_TABLE_DEBT","Debt")
TABLE_COMMENTARY = os.getenv("AIRTABLE_TABLE_COMMENTARY","Commentary")

HEADERS = {"Authorization": f"Bearer {AIRTABLE_TOKEN}", "Content-Type": "application/json"}

def _endpoint(table: str) -> str:
    import urllib.parse
    return f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{urllib.parse.quote(table)}"

def _create(table: str, fields: Dict[str, Any]):
    r = requests.post(_endpoint(table), headers=HEADERS, json={"records":[{"fields": fields}]}, timeout=30)
    r.raise_for_status(); return r.json()

def save_rumor(item: Dict[str, Any]):
    return _create(TABLE_RUMORS, {"Title": item.get("title",""), "Confidence": item.get("confidence",""),
                                  "Published": item.get("published",""), "Link": item.get("link",""),
                                  "Snippet": item.get("snippet",""), "Channel": "Rumor"})

def save_deal(item: Dict[str, Any]):
    return _create(TABLE_DEALS, {"Title": item.get("title",""), "Value": item.get("value",""),
                                 "Rationale": item.get("rationale",""), "Date": item.get("published",""),
                                 "Link": item.get("link",""), "Channel": "Deal"})

def save_filings_delta(item: Dict[str, Any]):
    return _create(TABLE_FILINGS, {"Title": item.get("title",""), "Risk Added": item.get("risk_added",0),
                                   "Risk Removed": item.get("risk_removed",0), "MD&A Added": item.get("mda_added",0),
                                   "MD&A Removed": item.get("mda_removed",0), "Channel": "Filings"})

def save_debt_heatmap_row(item: Dict[str, Any]):
    return _create(TABLE_DEBT, {"Bucket": item.get("bucket",""), "Total": item.get("total",0), "Channel": "Debt"})

def save_commentary_delta(item: Dict[str, Any]):
    diffs = item.get("diffs",{})
    return _create(TABLE_COMMENTARY, {"Title": item.get("title",""), "Tone": item.get("tone","Neutral"),
                                      "Added": ", ".join(diffs.get("added",[])[:15]),
                                      "Removed": ", ".join(diffs.get("removed",[])[:15]),
                                      "Reworded": ", ".join(diffs.get("reworded",[])[:15]),
                                      "Channel": "Commentary"})
