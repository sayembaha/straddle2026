from .utils import Http
from typing import Optional, List, Dict
SEC_BASE="https://data.sec.gov"; http=Http(headers={"User-Agent":"StraddleServerlessLite/0.1 (+contact@example.com)"})
def ticker_to_cik(ticker:str)->Optional[str]:
  t=(ticker or "").upper().strip(); idx=http.get(f"{SEC_BASE}/api/xbrl/company_tickers.json").json()
  for rec in idx.values():
    if rec.get("ticker","").upper()==t: return f"{rec['cik_str']:010d}"
  return None
def recent_filings_cik(cik:str, filing_type:str=None, count:int=10)->List[Dict]:
  sub=http.get(f"{SEC_BASE}/submissions/CIK{cik}.json").json(); fr=sub.get("filings",{}).get("recent",{}); forms=fr.get("form",[])
  out=[]; 
  for i,f in enumerate(forms):
    if filing_type and f!=filing_type: continue
    out.append({k:fr[k][i] for k in fr.keys()}); 
    if len(out)>=count: break
  return out
def filing_document_url(cik:str, accession_no:str, doc_name:str)->str:
  acc=accession_no.replace("-",""); return f"https://www.sec.gov/Archives/edgar/data/{int(cik)}/{acc}/{doc_name}"
def primary_doc_html(cik:str, accession_no:str)->str:
  acc=accession_no.replace("-",""); idx=http.get(f"https://www.sec.gov/Archives/edgar/data/{int(cik)}/{acc}/index.json").json()
  for f in idx.get("directory",{}).get("item",[]):
    n=f["name"].lower()
    if n.endswith(".htm") or n.endswith(".html"): return filing_document_url(cik, accession_no, f["name"])
  raise RuntimeError("No primary HTML")
