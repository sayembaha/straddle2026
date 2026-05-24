# Straddle — Vercel Serverless *Lite* (FREE)

Ultra-small Python build for Vercel free tier:
- No Docker, no compiled deps
- Handlers capped for fast execution
- Same-origin API (`/api/*`) + static `index.html`

## Deploy
1) Push this folder to GitHub.
2) Import to Vercel → Deploy (auto-detects `vercel.json`).
3) Open your URL and click **Run All**.

## Endpoints
- `/api/rumors?timeframe=30&keywords=M%26A,acquisition`
- `/api/deals?timeframe=60`
- `/api/filings?ticker=AAPL&filing=10-Q`
- `/api/debt?ticker=AAPL&filing=10-K`
- `/api/commentary?prior_url=...&current_url=...`

## Notes
- PDF parsing intentionally **disabled** to keep size small (HTML only).
- Update UA in `api/_lib/utils.py` to include your email (EDGAR etiquette).
- If you later need Notion/Airtable saves, add provider-specific functions with Vercel env vars.
