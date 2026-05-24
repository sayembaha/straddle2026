import json, re, feedparser
from bs4 import BeautifulSoup
from _lib.utils import clean_text
from datetime import datetime, timedelta, timezone

def parse_value(text):
  m=re.search(r"\$(\d+(?:\.\d+)?)\s*(billion|bn|million|mm|m)?", (text or '').lower())
  if not m: return ''
  amt=float(m.group(1)); unit=(m.group(2) or '')
  val=amt*1000 if unit in ('billion','bn') else amt
  return f"${val:.0f}M"

def handler(request, response):
  q=request.get('query',{}); timeframe=int(q.get('timeframe','60'))
  now=datetime.now(timezone.utc); earliest=now-timedelta(days=timeframe); out=[]
  feeds=[
    "https://news.google.com/rss/search?q=site:prnewswire.com+acquisition+OR+merger&hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss/search?q=site:businesswire.com+acquisition+OR+merger&hl=en-US&gl=US&ceid=US:en",
  ]
  for url in feeds:
    d=feedparser.parse(url)
    for e in d.entries[:20]:
      dt=now
      if getattr(e,'published_parsed',None): dt=datetime(*e.published_parsed[:6], tzinfo=timezone.utc)
      if dt<earliest: continue
      title=clean_text(getattr(e,'title','')); text=clean_text(BeautifulSoup(getattr(e,'summary',''), 'html.parser').get_text())
      out.append({"title":title,"value":parse_value(text),"rationale":"Strategic fit / synergy" if any(k in text.lower() for k in ['strategic','synerg']) else "","link":getattr(e,'link',''),"published":dt.isoformat()})
  response.status_code=200; response.headers['Content-Type']='application/json'; response.body=json.dumps({"items":out})
