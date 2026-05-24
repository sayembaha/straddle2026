import feedparser, re
from datetime import datetime, timedelta, timezone
from typing import List, Dict
from bs4 import BeautifulSoup
from .common.utils import clean_text

PR_FEEDS = [
    "https://news.google.com/rss/search?q=site:prnewswire.com+acquisition+OR+merger&hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss/search?q=site:businesswire.com+acquisition+OR+merger&hl=en-US&gl=US&ceid=US:en",
]

def parse_value(txt: str) -> str:
    m = re.search(r"\$(\d+(?:\.\d+)?)\s*(billion|bn|million|mm|m)?", txt.lower())
    if not m: return ""
    amt = float(m.group(1))
    unit = m.group(2) or ""
    if unit in ("billion","bn"): val = amt * 1_000
    elif unit in ("million","mm","m"): val = amt
    else: val = amt
    return f"${val:.0f}M"

def extract_card(entry) -> Dict:
    title = clean_text(getattr(entry, "title",""))
    html = getattr(entry, "summary","")
    text = clean_text(BeautifulSoup(html, "lxml").get_text())
    value = parse_value(text)
    rationale = ""
    for key in ("strategic","synergies","expansion","pipeline","platform","vertical","footprint","efficiencies"):
        if key in text.lower():
            rationale = "Strategic fit / synergy"
            break
    link = getattr(entry, "link","")
    return {"title": title, "value": value, "rationale": rationale, "link": link}

def gather(timeframe_days: int=60, sector_filter: str="") -> List[Dict]:
    now = datetime.now(timezone.utc)
    earliest = now - timedelta(days=timeframe_days)
    out = []
    for url in PR_FEEDS:
        d = feedparser.parse(url)
        for e in d.entries:
            published = getattr(e, "published_parsed", None)
            dt = datetime(*published[:6], tzinfo=timezone.utc) if published else now
            if dt < earliest: continue
            card = extract_card(e)
            card["published"] = dt.isoformat()
            out.append(card)
    return out
