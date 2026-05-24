import feedparser
from datetime import datetime, timedelta, timezone
from typing import List, Dict
from bs4 import BeautifulSoup
from .common.utils import clean_text

SOURCES = [
    "https://news.google.com/rss/search?q=acquisition+OR+merger&hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss/search?q=strategic+review&hl=en-US&gl=US&ceid=US:en",
]

def score_signal(title: str, summary: str) -> str:
    t = (title + " " + summary).lower()
    if "hiring" in t and ("m&a" in t or "mergers" in t): return "High"
    if "strategic review" in t or "exploring options" in t: return "High"
    if "resignation" in t or "steps down" in t: return "Medium"
    if "rumor" in t or "speculation" in t: return "Low"
    return "Medium"

def gather(timeframe_days: int=30, keywords: List[str]=None) -> List[Dict]:
    now = datetime.now(timezone.utc)
    earliest = now - timedelta(days=timeframe_days)
    out = []
    for url in SOURCES:
        d = feedparser.parse(url)
        for e in d.entries:
            published = getattr(e, "published_parsed", None)
            dt = datetime(*published[:6], tzinfo=timezone.utc) if published else now
            if dt < earliest: 
                continue
            title = clean_text(getattr(e, "title", ""))
            summary = clean_text(BeautifulSoup(getattr(e, "summary", ""), "lxml").get_text())
            link = getattr(e, "link", url)
            text = (title + " " + summary).lower()
            if keywords and not any(k.lower() in text for k in keywords):
                continue
            conf = score_signal(title, summary)
            out.append({"source": url, "title": title, "snippet": summary[:240], "confidence": conf, "link": link, "published": dt.isoformat()})
    return out
