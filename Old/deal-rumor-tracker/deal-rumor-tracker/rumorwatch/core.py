
import os, re, json, time, sqlite3, logging, requests, feedparser, pytz, datetime as dt
from bs4 import BeautifulSoup
from jinja2 import Environment, FileSystemLoader, select_autoescape
import trafilatura
from typing import List, Dict, Any, Tuple
from .config import DEFAULT_TZ, DEFAULT_DB, load_sources, load_signals
from .utils import now, parse_date, hash_str, normalize_text, match_any, recency_boost, source_boost

log = logging.getLogger("rumorwatch")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

USER_AGENT = os.getenv("RW_UA", "rumorwatch/0.1 (+https://example.com)")
TIMEOUT = float(os.getenv("RW_TIMEOUT", "20"))

def db_connect(path: str = DEFAULT_DB):
    os.makedirs(os.path.dirname(path), exist_ok=True) if os.path.dirname(path) else None
    con = sqlite3.connect(path)
    con.execute("PRAGMA journal_mode=WAL;")
    con.row_factory = sqlite3.Row
    return con

def db_init(con: sqlite3.Connection):
    con.executescript(
        """
        CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY,
          url TEXT UNIQUE,
          site TEXT,
          title TEXT,
          summary TEXT,
          published TEXT,
          first_seen TEXT,
          score REAL,
          reasons TEXT,
          signals TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_items_published ON items(published);
        CREATE INDEX IF NOT EXISTS idx_items_score ON items(score);
        """
    )
    con.commit()

def upsert_item(con, item: Dict[str, Any]):
    cur = con.cursor()
    cur.execute(
        """
        INSERT INTO items (url, site, title, summary, published, first_seen, score, reasons, signals)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(url) DO UPDATE SET
          title=excluded.title,
          summary=excluded.summary,
          published=excluded.published,
          score=excluded.score,
          reasons=excluded.reasons,
          signals=excluded.signals
        """,
        (
            item.get("url"),
            item.get("site"),
            item.get("title"),
            item.get("summary"),
            item.get("published"),
            item.get("first_seen"),
            item.get("score"),
            json.dumps(item.get("reasons", [])),
            json.dumps(item.get("signals", [])),
        ),
    )
    con.commit()

def fetch_url(url) -> requests.Response:
    headers = {"User-Agent": USER_AGENT}
    resp = requests.get(url, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp

def extract_text(url: str) -> str:
    try:
        downloaded = trafilatura.fetch_url(url)
        if not downloaded:
            return ""
        text = trafilatura.extract(downloaded, include_links=False, include_images=False)
        return text or ""
    except Exception as e:
        log.warning("trafilatura failed for %s: %s", url, e)
        return ""

def score_text(text: str, title: str, site: str, signals_conf: Dict[str, Any], tz=DEFAULT_TZ, tags=None) -> Tuple[float, List[str], List[str]]:
    full = f"{title or ''}\n{text or ''}"
    reasons = []
    hit_labels = []
    score = 0.0
    for sig in signals_conf.get("signals", []):
        label = sig.get("label")
        weight = float(sig.get("weight", 1))
        patterns = sig.get("patterns", [])
        matches = match_any(patterns, full)
        if matches:
            score += weight * len(matches)
            reasons.append(f"{label} ({len(matches)} hits)")
            hit_labels.append(label)
    # lightweight site-specific boosts or penalties via tags
    score = score * (1.0 + source_boost(tags))
    return score, reasons, hit_labels

def group_by_label(items: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    buckets = {}
    for it in items:
        for lab in it.get("signals", []):
            buckets.setdefault(lab, []).append(it)
    return buckets

def render_digest(items: List[Dict[str, Any]], tz=DEFAULT_TZ) -> str:
    # Sort by score desc then recency
    items = sorted(items, key=lambda x: (x.get("score", 0), x.get("published", "")), reverse=True)
    here = os.path.dirname(__file__)
    env = Environment(
        loader=FileSystemLoader(os.path.join(here, "templates")),
        autoescape=select_autoescape(["html", "xml"]),
    )
    tmpl = env.get_template("digest.html")
    grouped = group_by_label(items)
    return tmpl.render(
        items=items,
        grouped=grouped,
        generated_at=now(tz).strftime("%Y-%m-%d %H:%M %Z"),
        tz=tz,
    )

def email_send(subject: str, html: str, to_addrs: list):
    import smtplib
    from email.mime.text import MIMEText
    from email.utils import formatdate
    from .config import env_email_from, smtp_config

    cfg = smtp_config()
    if not cfg["host"] or not cfg["user"]:
        raise RuntimeError("SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM env vars.")

    msg = MIMEText(html, "html", "utf-8")
    msg["Subject"] = subject
    msg["From"] = env_email_from()
    msg["To"] = ", ".join(to_addrs)
    msg["Date"] = formatdate(localtime=True)

    with smtplib.SMTP(cfg["host"], cfg["port"]) as s:
        if cfg["starttls"]:
            s.starttls()
        s.login(cfg["user"], cfg["password"])
        s.sendmail(msg["From"], to_addrs, msg.as_string())

# ---------------- Crawlers ----------------

def crawl_rss(src: Dict[str, Any], signals_conf: Dict[str, Any], con: sqlite3.Connection):
    url = src["url"]
    tags = src.get("tags", [])
    feed = feedparser.parse(url)
    for e in feed.entries:
        link = e.get("link") or e.get("id")
        if not link: 
            continue
        title = e.get("title", "").strip()
        published = parse_date(e.get("published") or e.get("updated") or "", tz_name=DEFAULT_TZ)
        # Extract and score
        text = e.get("summary") or ""
        if not text:
            text = extract_text(link)
        score, reasons, hit_labels = score_text(text, title, src.get("site", url), signals_conf, tz=DEFAULT_TZ, tags=tags)
        # Recency boost
        score = score * recency_boost(published, tz_name=DEFAULT_TZ)
        item = {
            "url": link,
            "site": src.get("site") or feed.feed.get("title") or url,
            "title": title,
            "summary": text[:1000],
            "published": published.isoformat(),
            "first_seen": now(DEFAULT_TZ).isoformat(),
            "score": round(score, 2),
            "reasons": reasons,
            "signals": list(sorted(set(hit_labels))),
        }
        upsert_item(con, item)

def crawl_webpage_list(src: Dict[str, Any], signals_conf: Dict[str, Any], con: sqlite3.Connection):
    # Generic: fetch page, parse links that look like articles, score destination text
    url = src["url"]
    tags = src.get("tags", [])
    resp = fetch_url(url)
    soup = BeautifulSoup(resp.text, "html.parser")
    links = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith("#"): continue
        if href.startswith("/"):
            from urllib.parse import urljoin
            href = urljoin(url, href)
        text = a.get_text(strip=True)
        # crude heuristic for "article-like" anchor
        if len(text.split()) >= 4:
            links.append(href)
    links = list(dict.fromkeys(links))[:50]  # unique & cap
    for link in links:
        title = None
        try:
            page_text = extract_text(link)
            # try to find a title
            # (Trafilatura keeps titles sometimes; we fallback to last path segment)
            title = None
            if not title:
                title = (link.rstrip("/").split("/")[-1].replace("-", " ").replace("_", " "))[:140]
            score, reasons, hit_labels = score_text(page_text, title, src.get("site", url), signals_conf, tz=DEFAULT_TZ, tags=tags)
            # Unknown publish date => no recency boost
            item = {
                "url": link,
                "site": src.get("site") or url,
                "title": title,
                "summary": page_text[:1000],
                "published": None,
                "first_seen": now(DEFAULT_TZ).isoformat(),
                "score": round(score, 2),
                "reasons": reasons,
                "signals": list(sorted(set(hit_labels))),
            }
            upsert_item(con, item)
        except Exception as e:
            log.warning("webpage crawl failed %s: %s", link, e)

def crawl_greenhouse(src: Dict[str, Any], signals_conf: Dict[str, Any], con: sqlite3.Connection):
    # Greenhouse public API: https://boards-api.greenhouse.io/v1/boards/{org}/jobs?content=true
    org = src.get("org")
    if not org:
        return
    tags = src.get("tags", [])
    api = f"https://boards-api.greenhouse.io/v1/boards/{org}/jobs?content=true"
    try:
        resp = fetch_url(api)
        data = resp.json()
    except Exception as e:
        log.warning("greenhouse fetch failed for %s: %s", org, e)
        return
    for job in data.get("jobs", []):
        title = job.get("title") or ""
        content = job.get("content") or ""
        dep = (job.get("departments") or [{}])[0].get("name", "")
        loc = (job.get("offices") or [{}])[0].get("name", "")
        url = job.get("absolute_url")
        published = parse_date(job.get("updated_at") or job.get("created_at") or "", tz_name=DEFAULT_TZ)
        text = f"{title}\n{dep}\n{loc}\n{content}"
        score, reasons, hit_labels = score_text(text, title, org, signals_conf, tz=DEFAULT_TZ, tags=tags+["jobs"])
        score = score * recency_boost(published, tz_name=DEFAULT_TZ)
        item = {
            "url": url,
            "site": f"{org} (Greenhouse)",
            "title": title,
            "summary": BeautifulSoup(content, "html.parser").get_text()[:1000],
            "published": published.isoformat(),
            "first_seen": now(DEFAULT_TZ).isoformat(),
            "score": round(score, 2),
            "reasons": reasons,
            "signals": list(sorted(set(hit_labels))),
        }
        upsert_item(con, item)

def crawl_lever(src: Dict[str, Any], signals_conf: Dict[str, Any], con: sqlite3.Connection):
    # Lever public API: https://api.lever.co/v0/postings/{org}?limit=100&mode=json
    org = src.get("org")
    if not org:
        return
    tags = src.get("tags", [])
    api = f"https://api.lever.co/v0/postings/{org}?limit=100&mode=json"
    try:
        resp = fetch_url(api)
        data = resp.json()
    except Exception as e:
        log.warning("lever fetch failed for %s: %s", org, e)
        return
    for job in data:
        title = job.get("text") or ""
        content = job.get("lists") or []
        descr = job.get("descriptionPlain") or job.get("description") or ""
        url = job.get("hostedUrl")
        published = parse_date(job.get("createdAt") and str(dt.datetime.utcfromtimestamp(job["createdAt"]/1000.0)), tz_name=DEFAULT_TZ)
        join_lists = "\n".join([f"{x.get('text','')}: {', '.join([i.get('text','') for i in x.get('content',[])])}" for x in content])
        text = f"{title}\n{join_lists}\n{descr}"
        score, reasons, hit_labels = score_text(text, title, org, signals_conf, tz=DEFAULT_TZ, tags=tags+["jobs"])
        score = score * recency_boost(published, tz_name=DEFAULT_TZ)
        item = {
            "url": url,
            "site": f"{org} (Lever)",
            "title": title,
            "summary": (descr or "")[:1000],
            "published": published.isoformat(),
            "first_seen": now(DEFAULT_TZ).isoformat(),
            "score": round(score, 2),
            "reasons": reasons,
            "signals": list(sorted(set(hit_labels))),
        }
        upsert_item(con, item)

CRAWLERS = {
    "rss": crawl_rss,
    "web": crawl_webpage_list,
    "greenhouse": crawl_greenhouse,
    "lever": crawl_lever,
}

def run_crawl(sources_path: str, db_path: str = DEFAULT_DB):
    srcs = load_sources(sources_path).get("sources", [])
    signals_conf = load_signals().copy()
    con = db_connect(db_path)
    db_init(con)
    for src in srcs:
        typ = src.get("type", "rss")
        fn = CRAWLERS.get(typ)
        if not fn:
            log.warning("Unknown source type: %s", typ)
            continue
        try:
            fn(src, signals_conf, con)
        except Exception as e:
            log.exception("Crawler failed for %s %s: %s", typ, src.get("url") or src.get("org"), e)
    con.close()

def get_items(con, since_days=1, min_score=None, limit=200):
    q = "SELECT * FROM items WHERE 1=1"
    params = []
    if since_days:
        since = (now(DEFAULT_TZ) - dt.timedelta(days=since_days)).isoformat()
        q += " AND (published IS NULL OR published >= ?)"
        params.append(since)
    if min_score is not None:
        q += " AND score >= ?"
        params.append(min_score)
    q += " ORDER BY score DESC, COALESCE(published, first_seen) DESC LIMIT ?"
    params.append(limit)
    cur = con.execute(q, params)
    rows = [dict(r) for r in cur.fetchall()]
    # JSON-decode reasons/signals
    for r in rows:
        try:
            r["reasons"] = json.loads(r.get("reasons") or "[]")
            r["signals"] = json.loads(r.get("signals") or "[]")
        except Exception:
            r["reasons"] = []
            r["signals"] = []
    return rows

def run_digest(period="daily", to_addrs=None, min_score=5.0, db_path: str = DEFAULT_DB):
    con = db_connect(db_path)
    db_init(con)
    days = 1 if period == "daily" else 7
    items = get_items(con, since_days=days, min_score=min_score, limit=400)
    html = render_digest(items, tz=DEFAULT_TZ)
    con.close()
    subject = f"Deal Rumor Digest — {period.title()}"
    if to_addrs:
        email_send(subject, html, to_addrs)
    return subject, html
