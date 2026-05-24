# Straddle — Full Project

FastAPI backend + static frontend + deploy configs. Includes Notion/Airtable save endpoints.

## Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload
```
Open docs: http://127.0.0.1:8000/docs

## Frontend
Open `frontend/index.html` and set API in console:
```js
localStorage.setItem('STRADDLE_API','http://127.0.0.1:8000'); location.reload();
```

## Saving to Notion/Airtable
Set env on API:
```
SAVE_TARGET=notion  # or airtable
# Notion
NOTION_TOKEN=secret_...
NOTION_DB_GENERIC=<database_id>  # or per-channel IDs
# Airtable
AIRTABLE_TOKEN=pat...
AIRTABLE_BASE_ID=appXXXXXXXX
```
Use `/api/save` or `/api/save/bulk`.

## Docker Compose
```bash
export STRADDLE_UA="Straddle/0.1 (+your@email)"
docker compose up -d --build
# API -> :8000, Web -> :8080
```

## Render / Fly / Vercel
Use `render.yaml`, `fly.toml`, `vercel.json`.
