import json, re
from bs4 import BeautifulSoup
from _lib.utils import Http
from _lib.sec import ticker_to_cik, recent_filings_cik, primary_doc_html

def extract_heatmap(html):
  soup=BeautifulSoup(html,'html.parser'); buckets={}
  for tbl in soup.find_all('table'):
    head=" ".join(th.get_text(' ') for th in tbl.find_all('th')).lower()
    if 'maturit' not in head and 'debt' not in head: continue
    rows=tbl.find_all('tr'); 
    if not rows: continue
    headers=[th.get_text(' ').strip() for th in rows[0].find_all(['th','td'])]
    for tr in rows[1:]:
      cells=[td.get_text(' ').strip() for td in tr.find_all(['td','th'])]
      if len(cells)!=len(headers): continue
      for h,v in zip(headers,cells):
        if re.search(r"20\d{2}", h):
          try: num=float(re.sub(r"[^0-9.]", "", v) or "0")
          except: num=0.0
          buckets[h]=buckets.get(h,0.0)+num
  return [{"bucket":k,"total":v} for k,v in sorted(buckets.items())]

def handler(request, response):
  q=request.get('query',{}); ticker=q.get('ticker','AAPL'); filing=q.get('filing','10-K')
  cik=ticker_to_cik(ticker)
  if not cik: response.status_code=400; response.body=json.dumps({"error":"unknown ticker"}); return
  f=recent_filings_cik(cik, filing_type=filing, count=1)
  if not f: response.status_code=400; response.body=json.dumps({"error":"no filings"}); return
  url=primary_doc_html(cik, f[0]['accessionNumber']); html=Http().get(url).text
  response.status_code=200; response.headers['Content-Type']='application/json'; response.body=json.dumps({"heatmap":extract_heatmap(html)})
