import time, re, requests
from typing import Optional, Dict

DEFAULT_HEADERS = {
    "User-Agent": "StraddleScrapers/0.1 (+contact@example.com)",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

class Http:
    def __init__(self, headers: Optional[Dict[str,str]]=None, backoff: float=0.5):
        self.s = requests.Session()
        self.s.headers.update(DEFAULT_HEADERS | (headers or {}))
        self.backoff = backoff

    def get(self, url: str, **kw) -> requests.Response:
        r = self.s.get(url, timeout=30, **kw)
        if r.status_code == 429 or (500 <= r.status_code < 600):
            time.sleep(self.backoff)
            r = self.s.get(url, timeout=30, **kw)
        r.raise_for_status()
        return r

def clean_text(t: str) -> str:
    return re.sub(r"\s+", " ", t or "").strip()
