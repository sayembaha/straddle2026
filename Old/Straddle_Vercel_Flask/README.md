# Straddle — Vercel (Flask serverless)

This build uses **Flask** as a single WSGI app for all `/api/*` routes — the most reliable setup on Vercel free tier.

## Files
- `api/index.py` — Flask app with 5 endpoints:
  - `/api/rumors`, `/api/deals`, `/api/filings`, `/api/debt`, `/api/commentary`
- `index.html` — static UI that calls same-origin `/api/*`
- `vercel.json` — routes `/api/*` to `api/index.py`, everything else to the UI
- `requirements.txt` — tiny: requests, bs4, feedparser, Flask

## Deploy
1) Push to GitHub.
2) Vercel → New Project → Import repo → Deploy.
3) Open:
   - `/api/ping` → `{"ok": true}`
   - `/api/rumors` etc.
   - Root page → click buttons or **Run All**.

## Notes
- Update `STRADDLE_UA` env in Vercel (Project → Settings → Environment Variables) to include your email for SEC etiquette.
- Light parsing only (HTML). PDF parsing removed by design for size/perf.
