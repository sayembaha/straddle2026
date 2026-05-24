# Straddle — Deploy Guide

## First-time setup (do this once)

### 1. Install dependencies
Open a terminal in this folder and run:
```
npm install
```

### 2. Test locally
```
npm run dev
```
Open http://localhost:3000 — you should see Straddle running.

### 3. Create a GitHub repo
- Go to https://github.com/new
- Name it `straddle` (private or public)
- Don't initialize with README

### 4. Push to GitHub
Run these commands in this folder:
```
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/straddle.git
git push -u origin main
```

### 5. Deploy on Vercel (free)
- Go to https://vercel.com
- Click "Add New Project"
- Import your `straddle` GitHub repo
- Leave all settings as default — Vercel auto-detects Next.js
- Click Deploy

Your live URL will be: `https://straddle.vercel.app` (or similar)

---

## Ongoing workflow (after every Claude Cowork session)

When Claude makes changes to your files, run:
```
git add .
git commit -m "describe what changed"
git push
```

Vercel auto-deploys within ~30 seconds. That's it.

---

## Folder structure
```
straddle/
├── app/
│   ├── layout.tsx      ← metadata, fonts, global CSS
│   └── page.tsx        ← entry point (imports Straddle component)
├── components/
│   └── straddle.tsx    ← YOUR MAIN FILE (Claude edits this)
├── public/             ← static assets (images, icons)
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

**Claude only needs to touch `components/straddle.tsx`** for most changes.
For new pages or features, new files go in `app/` or `components/`.
