import json, re
from bs4 import BeautifulSoup
from _lib.utils import Http, clean_text
from _lib.sec import ticker_to_cik, recent_filings_cik, primary_doc_html

ITEMS={
  "Risk Factors": re.compile(r"item\s*1a\.?\s*risk factors", re.I),
  "MD&A": re.compile(r"item\s*7\.?\s*management(?:'s)? discussion", re.I),
}
def section_text(html, patt):
  soup=BeautifulSoup(html,'html.parser'); text=clean_text(soup.get_text(' '))
  m=patt.search(text); 
  if not m: return ""
  start=m.start()
  nxt=re.search(r"item\s+\d+\s", text[start+10:], re.I)
  end=start+10+nxt.start() if nxt else len(text)
  return text[start:end]

def handler(request, response):
  q=request.get('query',{}); ticker=q.get('ticker','AAPL'); filing=q.get('filing','10-Q')
  cik=ticker_to_cik(ticker)
  if not cik: response.status_code=400; response.body=json.dumps({"error":"unknown ticker"}); return
  filings=recent_filings_cik(cik, filing_type=filing, count=2)
  if len(filings)<2: response.status_code=400; response.body=json.dumps({"error":"not enough filings"}); return
  http=Http()
  cur=http.get(primary_doc_html(cik, filings[0]['accessionNumber'])).text
  prev=http.get(primary_doc_html(cik, filings[1]['accessionNumber'])).text
  out={}
  for name,p in ITEMS.items():
    a=section_text(cur,p); b=section_text(prev,p)
    add=len(set(a.split())-set(b.split())); rem=len(set(b.split())-set(a.split()))
    out[name]={"added_tokens":add,"removed_tokens":rem}
  response.status_code=200; response.headers['Content-Type']='application/json'; response.body=json.dumps(out)
