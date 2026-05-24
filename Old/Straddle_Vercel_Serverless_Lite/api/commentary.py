import json, re
from bs4 import BeautifulSoup
from _lib.utils import Http, clean_text

POS={"growth","accelerate","record","profitability","margin expansion","ahead"}
NEG={"restructuring","headwinds","softness","pressure","decline","delay","impairment"}

def fetch_text(url):
  r=Http().get(url)
  soup=BeautifulSoup(r.text,'html.parser')
  for s in soup(['script','style','noscript']): s.decompose()
  return clean_text(soup.get_text(' '))

def diffs(a,b, min_len=3):
  A=[w for w in re.findall(r"[A-Za-z][A-Za-z\-]{%d,}"%(min_len-1), a)]
  B=[w for w in re.findall(r"[A-Za-z][A-Za-z\-]{%d,}"%(min_len-1), b)]
  add=sorted(set(B)-set(A)); rem=sorted(set(A)-set(B))
  rw=[w for w in add if any(w[:4]==x[:4] for x in rem)]
  return {"added":add[:40],"removed":rem[:40],"reworded":rw[:25]}

def tone(t):
  tl=t.lower(); p=sum(1 for k in POS if k in tl); n=sum(1 for k in NEG if k in tl)
  return "Negative" if n>p else ("Positive" if p>n else "Neutral")

def handler(request, response):
  q=request.get('query',{}); prior=q.get('prior_url',''); current=q.get('current_url','')
  if not prior or not current: response.status_code=400; response.body=json.dumps({"error":"prior_url and current_url required"}); return
  a=fetch_text(prior); b=fetch_text(current)
  response.status_code=200; response.headers['Content-Type']='application/json'; response.body=json.dumps({"tone":tone(b),"diffs":diffs(a,b)})
