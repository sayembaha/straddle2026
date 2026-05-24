# Deal Rumor & Pre-Announcement Tracker (rumorwatch)

Monitors niche industry blogs, trade press, local news, and job boards for **deal signals** (e.g., “strategic alternatives,” “retained advisor,” “board resignation,” **M&A** hiring).  
Generates a **daily or weekly Deal Rumor Digest** via email.

## Quickstart

```bash
# 1) Create virtual env
python3 -m venv .venv && source .venv/bin/activate

# 2) Install deps
pip install -r requirements.txt

# 3) (Optional) Edit sources & signals
nano rumorwatch/sources.yaml
nano rumorwatch/signals.yaml

# 4) Run a crawl (collects & scores items)
python -m rumorwatch.cli crawl --sources rumorwatch/sources.yaml --verbose

# 5) Send yourself a digest (last 1 day or 7 days)
export SMTP_HOST="smtp.gmail.com"
export SMTP_PORT="587"
export SMTP_USER="YOUR_SMTP_USER"
export SMTP_PASS="YOUR_SMTP_PASS"
export SMTP_FROM="Deal Rumor Tracker <no-reply@yourdomain.com>"

python -m rumorwatch.cli digest --period daily --to you@example.com
# or
python -m rumorwatch.cli digest --period weekly --to you@example.com
```

### Cron examples (server)
```
# Crawl every hour, 6 AM–10 PM Dhaka time
0 6-22 * * * cd /opt/deal-rumor-tracker && /opt/venv/bin/python -m rumorwatch.cli crawl --sources rumorwatch/sources.yaml >> logs/crawl.log 2>&1

# Send the daily digest at 07:30 Dhaka time
30 7 * * * cd /opt/deal-rumor-tracker && /opt/venv/bin/python -m rumorwatch.cli digest --period daily --to alerts@yourteam.com >> logs/digest.log 2>&1

# Send the weekly digest every Monday 08:00 Dhaka time
0 8 * * 1 cd /opt/deal-rumor-tracker && /opt/venv/bin/python -m rumorwatch.cli digest --period weekly --to alerts@yourteam.com >> logs/digest.log 2>&1
```

## What counts as a “deal signal”?
Signals & weights are configurable in `rumorwatch/signals.yaml`. Defaults include:
- **Strategic alternatives / exploring options**
- **Retained financial adviser (banker names, advisory verbs)**
- **Board resignations & director changes**
- **Activist pressure / poison pill / rights plan**
- **Special committee formation**
- **Unusual trading / trading halts**
- **Job postings** with M&A / Corporate Dev / Strategic Finance keywords

## Data ownership & compliance
- Only scrapes publicly-available pages and RSS feeds you list.
- Respects robots.txt when enabled (RSS is used where possible).
- You are responsible for respecting each site’s Terms of Service. Consider paid APIs / data partnerships for scale.

## Directory
```
deal-rumor-tracker/
├── README.md
├── requirements.txt
├── rumorwatch/
│   ├── __init__.py
│   ├── cli.py
│   ├── core.py
│   ├── config.py
│   ├── utils.py
│   ├── signals.yaml
│   ├── sources.yaml
│   └── templates/
│       └── digest.html
└── (created at runtime) rumorwatch.db
```
