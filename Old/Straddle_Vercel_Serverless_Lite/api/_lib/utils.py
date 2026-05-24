import re, time, requests, os
DEFAULT_HEADERS = {
  "User-Agent": os.getenv("STRADDLE_UA","StraddleServerlessLite/0.1 (+contact@example.com)"),
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
}
class Http:
  def __init__(self, headers=None, backoff=0.4):
    self.s = requests.Session(); h=dict(DEFAULT_HEADERS); 
    if headers: h.update(headers); self.s.headers.update(h); self.backoff=backoff
  def get(self, url, **kw):
    r=self.s.get(url, timeout=8, **kw)
    if r.status_code in (429,500,502,503,504): time.sleep(self.backoff); r=self.s.get(url, timeout=8, **kw)
    r.raise_for_status(); return r
def clean_text(t:str)->str: return re.sub(r"\s+"," ", t or "").strip()
