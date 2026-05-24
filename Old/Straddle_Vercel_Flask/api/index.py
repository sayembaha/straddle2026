from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
import feedparser, requests, os, time, re
from datetime import datetime, timedelta, timezone

# --- tiny helpers ---
DEFAULT_HEADERS = {
    "User-Agent": os.getenv("STRADDLE_UA","StraddleVercelFlask/0.1 (+youremail@example.com)"),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}
class Http:
    def __init__(self, headers=None, backoff=0.4):
        self.s = requests.Session()
        h = dict(DEFAULT_HEADERS)
        if headers: h.update(headers)
        self.s.headers.update(h)
        self.backoff = backoff
    def get(self, url, **kw):
        r = self.s.get(url, timeout=8, **kw)
        if r.status_code in (429,500,502,503,504):
            time.sleep(self.backoff); r = self.s.get(url, timeout=8, **kw)
        r.raise_for_status(); return r

def clean_text(t): return re.sub(r"\s+"," ", t or "").strip()

# --- minimal SEC helpers ---
SEC_BASE = "https://data.sec.gov"
http_sec = Http(headers={"User-Agent": DEFAULT_HEADERS["User-Agent"]})

def ticker_to_cik(ticker: str):
    t = (ticker or "").upper().strip()
    idx = http_sec.get(f"{SEC_BASE}/api/xbrl/company_tickers.json").json()
    for rec in idx.values():
        if rec.get("ticker","").upper() == t:
            return f"{rec['cik_str']:010d}"
    return None

def recent_filings_cik(cik: str, filing_type: str=None, count: int=10):
    sub = http_sec.get(f"{SEC_BASE}/submissions/CIK{cik}.json").json()
    fr = sub.get("filings",{}).get("recent",{})
    forms = fr.get("form",[])
    out=[]
    for i, form in enumerate(forms):
        if filing_type and form != filing_type: 
            continue
        out.append({k: fr[k][i] for k in fr.keys()})
        if len(out) >= count: break
    return out

def filing_document_url(cik: str, accession_no: str, doc_name: str):
    acc = accession_no.replace("-","")
    return f"https://www.sec.gov/Archives/edgar/data/{int(cik)}/{acc}/{doc_name}"

def primary_doc_html(cik: str, accession_no: str):
    acc = accession_no.replace("-","")
    idx = http_sec.get(f"https://www.sec.gov/Archives/edgar/data/{int(cik)}/{acc}/index.json").json()
    for f in idx.get("directory",{}).get("item",[]):
        n = f["name"].lower()
        if n.endswith(".htm") or n.endswith(".html"):
            return filing_document_url(cik, accession_no, f["name"])
    return None

# --- Flask app ---
app = Flask(__name__)

@app.get("/api/ping")
def ping():
    return jsonify({"ok": True})

@app.get("/api/rumors")
def rumors():
    timeframe = int(request.args.get("timeframe", 30))
    keywords = [k.strip().lower() for k in (request.args.get("keywords","")).split(",") if k.strip()]
    now = datetime.now(timezone.utc); earliest = now - timedelta(days=timeframe)
    def score(title, summary):
        t = (title + " " + summary).lower()
        if "strategic review" in t or "exploring options" in t: return "High"
        if "hiring" in t and ("m&a" in t or "mergers" in t): return "High"
        if "resignation" in t or "steps down" in t: return "Medium"
        if "rumor" in t or "speculation" in t: return "Low"
        return "Medium"
    feeds = [
        "https://news.google.com/rss/search?q=acquisition+OR+merger&hl=en-US&gl=US&ceid=US:en",
        "https://news.google.com/rss/search?q=strategic+review&hl=en-US&gl=US&ceid=US:en",
    ]
    out = []
    for url in feeds:
        d = feedparser.parse(url)
        for e in d.entries[:20]:
            dt = now
            if getattr(e, "published_parsed", None):
                dt = datetime(*e.published_parsed[:6], tzinfo=timezone.utc)
            if dt < earliest: 
                continue
            title = clean_text(getattr(e, "title", ""))
            summary = clean_text(BeautifulSoup(getattr(e, "summary", ""), "html.parser").get_text())
            if keywords and not any(k in (title+" "+summary).lower() for k in keywords):
                continue
            out.append({
                "source": url, "title": title, "snippet": summary[:240],
                "confidence": score(title, summary),
                "link": getattr(e, "link", url), "published": dt.isoformat()
            })
    return jsonify(out)

@app.get("/api/deals")
def deals():
    timeframe = int(request.args.get("timeframe", 60))
    now = datetime.now(timezone.utc); earliest = now - timedelta(days=timeframe)
    feeds = [
        "https://news.google.com/rss/search?q=site:prnewswire.com+acquisition+OR+merger&hl=en-US&gl=US&ceid=US:en",
        "https://news.google.com/rss/search?q=site:businesswire.com+acquisition+OR+merger&hl=en-US&gl=US&ceid=US:en",
    ]
    out=[]
    def parse_value(text):
        m = re.search(r"\$(\d+(?:\.\d+)?)\s*(billion|bn|million|mm|m)?", (text or "").lower())
        if not m: return ""
        amt = float(m.group(1)); unit = (m.group(2) or "")
        val = amt * 1000 if unit in ("billion","bn") else amt
        return f"${val:.0f}M"
    for url in feeds:
        d = feedparser.parse(url)
        for e in d.entries[:20]:
            dt = now
            if getattr(e, "published_parsed", None):
                dt = datetime(*e.published_parsed[:6], tzinfo=timezone.utc)
            if dt < earliest: continue
            title = clean_text(getattr(e, "title", ""))
            text = clean_text(BeautifulSoup(getattr(e, "summary", ""), "html.parser").get_text())
            out.append({
                "title": title, "value": parse_value(text),
                "rationale": "Strategic fit / synergy" if any(k in text.lower() for k in ["strategic","synerg"]) else "",
                "link": getattr(e,"link",""), "published": dt.isoformat()
            })
    return jsonify({"items": out})

@app.get("/api/filings")
def filings():
    ticker = request.args.get("ticker", "AAPL")
    filing = request.args.get("filing", "10-Q")
    cik = ticker_to_cik(ticker)
    if not cik: return jsonify({"error":"unknown ticker"}), 400
    fs = recent_filings_cik(cik, filing_type=filing, count=2)
    if len(fs) < 2: return jsonify({"error":"not enough filings"}), 400
    http = Http()
    cur = http.get(primary_doc_html(cik, fs[0]["accessionNumber"])).text
    prev = http.get(primary_doc_html(cik, fs[1]["accessionNumber"])).text
    ITEMS = {
        "Risk Factors": re.compile(r"item\s*1a\.?\s*risk factors", re.I),
        "MD&A": re.compile(r"item\s*7\.?\s*management(?:'s)? discussion", re.I),
    }
    def section_text(html, patt):
        soup = BeautifulSoup(html, "html.parser")
        text = clean_text(soup.get_text(" "))
        m = patt.search(text)
        if not m: return ""
        start = m.start()
        nxt = re.search(r"item\s+\d+\s", text[start+10:], re.I)
        end = start + 10 + (nxt.start() if nxt else 0)
        return text[start:end] if end > start else text[start:]
    out = {}
    for name, patt in ITEMS.items():
        a = section_text(cur, patt); b = section_text(prev, patt)
        add = len(set(a.split()) - set(b.split()))
        rem = len(set(b.split()) - set(a.split()))
        out[name] = {"added_tokens": add, "removed_tokens": rem}
    return jsonify(out)

@app.get("/api/debt")
def debt():
    ticker = request.args.get("ticker", "AAPL")
    filing = request.args.get("filing", "10-K")
    cik = ticker_to_cik(ticker)
    if not cik: return jsonify({"error":"unknown ticker"}), 400
    fs = recent_filings_cik(cik, filing_type=filing, count=1)
    if not fs: return jsonify({"error":"no filings"}), 400
    url = primary_doc_html(cik, fs[0]["accessionNumber"])
    html = Http().get(url).text
    soup = BeautifulSoup(html, "html.parser")
    buckets = {}
    for tbl in soup.find_all("table"):
        head = " ".join(th.get_text(" ") for th in tbl.find_all("th")).lower()
        if "maturit" not in head and "debt" not in head: 
            continue
        rows = tbl.find_all("tr")
        if not rows: continue
        headers = [th.get_text(" ").strip() for th in rows[0].find_all(["th","td"])]
        for tr in rows[1:]:
            cells = [td.get_text(" ").strip() for td in tr.find_all(["td","th"])]
            if len(cells) != len(headers): continue
            for h, v in zip(headers, cells):
                if re.search(r"20\d{2}", h):
                    try: num = float(re.sub(r"[^0-9.]", "", v) or "0")
                    except: num = 0.0
                    buckets[h] = buckets.get(h, 0.0) + num
    heat = [{"bucket": k, "total": v} for k, v in sorted(buckets.items())]
    return jsonify({"heatmap": heat})

@app.get("/api/commentary")
def commentary():
    prior = request.args.get("prior_url", "")
    current = request.args.get("current_url", "")
    if not prior or not current:
        return jsonify({"error":"prior_url and current_url required"}), 400
    http = Http()
    a = http.get(prior).text
    b = http.get(current).text
    def extract_text(html):
        soup = BeautifulSoup(html, "html.parser")
        for s in soup(["script","style","noscript"]): s.decompose()
        return clean_text(soup.get_text(" "))
    A = extract_text(a); B = extract_text(b)
    POS = {"growth","accelerate","record","profitability","margin expansion","ahead"}
    NEG = {"restructuring","headwinds","softness","pressure","decline","delay","impairment"}
    def tone(t):
        tl = t.lower()
        p = sum(1 for k in POS if k in tl); n = sum(1 for k in NEG if k in tl)
        return "Negative" if n>p else ("Positive" if p>n else "Neutral")
    def diffs(x, y, min_len=3):
        Ax = [w for w in re.findall(r"[A-Za-z][A-Za-z\-]{%d,}"%(min_len-1), x)]
        By = [w for w in re.findall(r"[A-Za-z][A-Za-z\-]{%d,}"%(min_len-1), y)]
        add = sorted(set(By)-set(Ax)); rem = sorted(set(Ax)-set(By))
        rw = [w for w in add if any(w[:4]==r[:4] for r in rem)]
        return {"added": add[:40], "removed": rem[:40], "reworded": rw[:25]}
    return jsonify({"tone": tone(B), "diffs": diffs(A,B)})
