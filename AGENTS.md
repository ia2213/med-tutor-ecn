# MedTutor ECN — Agent Instructions

Medical tutoring web app for French ECN/EDN students. PDF upload + AI chat powered by OmniRoute.

## Stack

- **Frontend**: Single HTML file with inline CSS/JS
- **Proxy server**: Python `server.py` (port 8765) — serves frontend + proxies `/api/*` to Node backend
- **AI backend**: Node.js (port 4000, separate project — not in this repo)
- **AI engine**: OmniRoute local (port 20128)
- **Deployment**: GitHub Pages (static) / Vercel / local dev

## Key Files

```
index.html        — Single-page app (HTML + CSS + JS)
server.py         — Python proxy: serves static files + forwards /api/* to Node
vercel.json       — Vercel deployment config
OMNIRUTE.md       — OmniRoute usage notes
README.md         — Deployment status
```

## How It Works

1. User opens http://localhost:8765 (or GitHub Pages)
2. User uploads a medical PDF → `POST /api/upload` → Node backend extracts all pages
3. User selects a specialty (16 ECN presets) + asks a question → `POST /api/chat`
4. Backend searches PDF chunks by keyword, sends context + question to OmniRoute
5. OmniRoute responds with AI answer (French, pedagogical)

## OmniRoute Rules (Critical)

- **Always use `stream: false`** in chat requests — OmniRoute returns SSE by default
- **Mixed content**: HTTPS pages cannot call `http://localhost:20128`
- Chat works from local HTTP (port 8765), NOT from GitHub Pages (HTTPS)

## API Endpoints (proxied through server.py)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Backend + OmniRoute status |
| GET | `/api/books` | List uploaded books |
| POST | `/api/upload` | Upload + extract PDF |
| DELETE | `/api/books/:id` | Delete a book |
| POST | `/api/chat` | AI chat (with optional book context) |
| GET | `/api/search/:id?q=` | Keyword search in book |

## Running Locally

```bash
# Terminal 1: Node backend (separate project, port 4000)
node index.js

# Terminal 2: Python proxy (this repo, port 8765)
python3 server.py
```

Open http://localhost:8765

## 16 ECN Specialties

Cardiologie, Endocrinologie, Neurologie, Pneumologie, Gastro-entérologie, Oncologie, Maladies infectieuses, Rhumatologie, Néphrologie, Hématologie, Psychiatrie, Pédiatrie, Gynécologie-Obstétrique, Urgences-Réanimation, Pharmacologie, Biologie médicale.

## Rules

- Frontend is pure HTML/JS — no framework, no build step
- All JS is inline in `index.html` — edit in-place
- Python server proxies `/api/*` to Node backend — don't change port without updating JS
- GitHub Pages = static only. Chat requires local servers or Vercel with API routes
- All UI text in French
- PDF max size: 100MB (enforced by Node backend)

## Deployment

- **GitHub Pages**: Static UI only (no chat). URL: https://ia2213.github.io/med-tutor-ecn/
- **Vercel**: Static export (`vercel.json`), same limitation
- **Full chat**: Requires running `server.py` + Node backend locally

## Common Issues

| Problem | Fix |
|---------|-----|
| Chat returns SSE error | Add `"stream": false` to OmniRoute request |
| "Mixed content" error | Use http://localhost:8765, not GitHub Pages HTTPS |
| PDF upload hangs | Check Node backend is running on port 4000 |
| Books not showing | Check `extracts/` directory exists in Node backend |
