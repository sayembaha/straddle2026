
import re, hashlib, time, logging, pytz, datetime as dt
from dateutil import parser as dateparser

log = logging.getLogger("rumorwatch")

def now(tz_name="Asia/Dhaka"):
    tz = pytz.timezone(tz_name)
    return dt.datetime.now(tz)

def parse_date(dstr, fallback=None, tz_name="Asia/Dhaka"):
    if not dstr:
        return fallback or now(tz_name)
    try:
        d = dateparser.parse(dstr)
        if not d.tzinfo:
            d = d.replace(tzinfo=pytz.UTC)
        return d.astimezone(pytz.timezone(tz_name))
    except Exception:
        return fallback or now(tz_name)

def hash_str(s: str):
    return hashlib.sha256(s.encode("utf-8")).hexdigest()

def normalize_text(s: str):
    return re.sub(r"\s+", " ", (s or "")).strip()

def match_any(patterns, text):
    found = []
    if not text:
        return found
    for pat in patterns:
        try:
            if re.search(pat, text, flags=re.I|re.M):
                found.append(pat)
        except re.error:
            # If a regex is invalid, fallback to substring search
            if pat.lower() in text.lower():
                found.append(pat)
    return found

def recency_boost(published, tz_name="Asia/Dhaka"):
    # 1.0 if within 24h, decays to 0.6 by 14 days, floor 0.5 after that
    if not published:
        return 1.0
    now_dt = now(tz_name)
    days = max(0.0, (now_dt - published).total_seconds() / 86400.0)
    if days <= 1:
        return 1.0
    if days <= 14:
        return 1.0 - 0.4*(days/14.0)
    return 0.5

def source_boost(tags):
    tags = tags or []
    boost = 0.0
    if "trade" in tags: boost += 0.2
    if "local" in tags: boost += 0.1
    if "niche" in tags: boost += 0.2
    if "wire" in tags: boost -= 0.1
    return boost
