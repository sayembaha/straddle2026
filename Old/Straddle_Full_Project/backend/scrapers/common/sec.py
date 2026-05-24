import re
from typing import Optional, List, Dict
from .utils import Http

SEC_BASE = "https://data.sec.gov"
HEADERS = {"User-Agent": "StraddleScrapers/0.1 (+contact@example.com)"}
http = Http(headers=HEADERS)

def ticker_to_cik(ticker: str) -> Optional[str]:
    t = ticker.upper().strip()
    idx = http.get(f"{SEC_BASE}/api/xbrl/company_tickers.json").json()
    for rec in idx.values():
        if rec.get("ticker","").upper() == t:
            return f"{rec['cik_str']:010d}"
    return None

def recent_filings_cik(cik: str, filing_type: Optional[str]=None, count: int=10) -> List[Dict]:
    sub = http.get(f"{SEC_BASE}/submissions/CIK{cik}.json").json()
    res = []
    for i, form in enumerate(sub.get("filings", {}).get("recent", {}).get("form", [])):
        if filing_type and form != filing_type:
            continue
        item = {k: sub["filings"]["recent"][k][i] for k in sub["filings"]["recent"].keys()}
        res.append(item)
        if len(res) >= count: break
    return res

def filing_document_url(cik: str, accession_no: str, doc_name: str) -> str:
    acc = accession_no.replace("-", "")
    return f"https://www.sec.gov/Archives/edgar/data/{int(cik)}/{acc}/{doc_name}"

def primary_doc_html(cik: str, accession_no: str) -> str:
    acc = accession_no.replace("-", "")
    index_url = f"https://www.sec.gov/Archives/edgar/data/{int(cik)}/{acc}/index.json"
    idx = http.get(index_url).json()
    for f in idx.get("directory", {}).get("item", []):
        n = f["name"].lower()
        if n.endswith(".htm") or n.endswith(".html"):
            return filing_document_url(cik, accession_no, f["name"])
    raise RuntimeError("No primary HTML found")
