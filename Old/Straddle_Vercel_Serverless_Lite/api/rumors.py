import json, feedparser
from bs4 import BeautifulSoup
from datetime import datetime, timedelta, timezone
from _lib.utils import clean_text

def score(title, summary):
  t=(title+' '+summary).lower()
  if 'strategic review' in t or 'exploring options' in t: return 'High'
  if 'hiring' in t and ('m&a' in t or 'mergers' in t): return 'High'
  if 'resignation' in t or 'steps down' in t: return 'Medium'
  if 'rumor' in t or 'speculation' in t: return 'Low'
  return 'Medium'

def handler(request, response):
  q=request.get('query',{}); timeframe=int(q.get('timeframe','30'))
  kws=[k.strip().lower() for k in q.get('keywords','').split(',') if k.strip()]
  now=datetime.now(timezone.utc); earliest=now - timedelta(days=timeframe)
  out=[]; feeds=[
    "https://news.google.com/rss/search?q=acquisition+OR+merger&hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss/search?q=strategic+review&hl=en-US&gl=US&ceid=US:en",
  ]
  for url in feeds:
    d=feedparser.parse(url)
    for e in d.entries[:20]:
      dt=now
      if getattr(e,'published_parsed',None): dt=datetime(*e.published_parsed[:6], tzinfo=timezone.utc)
      if dt<earliest: continue
      title=clean_text(getattr(e,'title','')); summary=clean_text(BeautifulSoup(getattr(e,'summary',''), 'html.parser').get_text())
      if kws and not any(k in (title+' '+summary).lower() for k in kws): continue
      out.append({"source":url,"title":title,"snippet":summary[:240],"confidence":score(title,summary),"link":getattr(e,'link',url),"published":dt.isoformat()})
  response.status_code=200; response.headers['Content-Type']='application/json'; response.body=json.dumps(out)
