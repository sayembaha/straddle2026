import io, re
from bs4 import BeautifulSoup
from typing import Dict, List
from .common.utils import Http, clean_text

def fetch_text_from_url(url: str) -> str:
    http = Http()
    r = http.get(url)
    ct = r.headers.get("Content-Type","").lower()
    if "pdf" in ct or url.lower().endswith(".pdf"):
        try:
            from pdfminer.high_level import extract_text
            return extract_text(io.BytesIO(r.content))
        except Exception:
            return ""
    else:
        soup = BeautifulSoup(r.text, "lxml")
        for s in soup(["script","style","noscript"]): s.decompose()
        return clean_text(soup.get_text(" "))

def word_diff(a: str, b: str, min_len: int=3) -> Dict[str, List[str]]:
    A = [w for w in re.findall(r"[A-Za-z][A-Za-z\-]{%d,}"%(min_len-1), a)]
    B = [w for w in re.findall(r"[A-Za-z][A-Za-z\-]{%d,}"%(min_len-1), b)]
    added = sorted(set(B) - set(A))
    removed = sorted(set(A) - set(B))
    reworded = [w for w in added if any(w[:4]==x[:4] for x in removed)]
    return {"added": added[:50], "removed": removed[:50], "reworded": reworded[:30]}

TONE_POS = {"growth","accelerate","record","profitability","margin expansion","ahead"}
TONE_NEG = {"restructuring","headwinds","softness","pressure","decline","delay","impairment"}

def infer_tone(text: str) -> str:
    t = text.lower()
    pos = sum(1 for k in TONE_POS if k in t)
    neg = sum(1 for k in TONE_NEG if k in t)
    if neg > pos: return "Negative"
    if pos > neg: return "Positive"
    return "Neutral"

def compare_docs(prior_url: str, current_url: str) -> Dict:
    prior = fetch_text_from_url(prior_url)
    curr = fetch_text_from_url(current_url)
    diffs = word_diff(prior, curr)
    tone = infer_tone(curr)
    return {"tone": tone, "diffs": diffs}
