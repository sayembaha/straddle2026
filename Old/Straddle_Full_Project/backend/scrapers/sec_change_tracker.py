import re
from bs4 import BeautifulSoup
from typing import Dict, Optional
from .common.sec import ticker_to_cik, recent_filings_cik, primary_doc_html
from .common.utils import Http, clean_text

ITEM_MAP = {
    "Risk Factors": re.compile(r"item\s*1a\.?\s*risk factors", re.I),
    "MD&A": re.compile(r"item\s*7\.?\s*management(?:'s)? discussion", re.I),
}

def fetch_section_text(html: str, pattern: re.Pattern) -> Optional[str]:
    soup = BeautifulSoup(html, "lxml")
    start = None
    for el in soup.find_all(text=pattern):
        start = el.parent
        break
    if not start: return None
    texts = [start.get_text(" ")]
    for sib in start.find_all_next():
        if sib.get_text() and re.search(r"item\s+\d+\s", sib.get_text(), re.I):
            break
        texts.append(sib.get_text(" "))
    return clean_text(" ".join(texts))

def load_filing_html(ticker: str, filing_type: str, index: int=0) -> str:
    cik = ticker_to_cik(ticker)
    if not cik: raise RuntimeError(f"Could not map ticker {ticker} to CIK")
    filings = recent_filings_cik(cik, filing_type=filing_type, count=2+index)
    if len(filings) <= index: raise RuntimeError(f"Not enough {filing_type} for {ticker}")
    acc = filings[index]["accessionNumber"]
    url = primary_doc_html(cik, acc)
    http = Http()
    return http.get(url).text

def compare_sections(cur: str, prev: str) -> Dict[str, Dict[str, int]]:
    out = {}
    for name, patt in ITEM_MAP.items():
        cur_s = fetch_section_text(cur, patt) or ""
        prev_s = fetch_section_text(prev, patt) or ""
        add = len(set(cur_s.split()) - set(prev_s.split()))
        rem = len(set(prev_s.split()) - set(cur_s.split()))
        out[name] = {"added_tokens": add, "removed_tokens": rem}
    return out
