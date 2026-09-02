---
name: med-tutor-ecn
description: Use when working on MedTutor ECN — PDF medical textbook chat app for French ECN/EDN students. Covers OmniRoute integration, PDF extraction, Python proxy server, and GitHub Pages deployment.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [med-tutor, ecn, pdf, medical, omni-route, chat, tutoring, french]
    related_skills: [omniroute-integration, pdf-medical-tutoring, github-pages-deploy, nextjs-api-pitfalls]
---

# MedTutor ECN — Project Skill

## Overview

MedTutor ECN is a single-page web app that lets French medical students upload PDF textbooks and chat with an AI about their content. Powered by OmniRoute local AI.

**Repo**: https://github.com/ia2213/med-tutor-ecn
**Live**: https://ia2213.github.io/med-tutor-ecn/ (UI only — chat requires local servers)

## When to Use

- Modifying the frontend HTML/CSS/JS in `index.html`
- Changing the Python proxy server in `server.py`
- Updating OmniRoute integration or chat logic
- Fixing GitHub Pages deployment issues
- Adding new ECN specialties or presets
- PDF upload/processing workflow changes

## Architecture

```
Browser → server.py:8765 (Python proxy)
              ├── GET /      → serves index.html (static)
              └── /api/*     → proxies to Node backend :4000
                                   ├── PDF extraction (pdfjs-dist)
                                   ├── Book storage (extracts/*.json)
                                   └── AI chat → OmniRoute :20128
```

## Key Files

| File | Size | Purpose |
|------|------|---------|
| `index.html` | 360 lines | Full frontend — HTML, CSS, JS |
| `server.py` | 144 lines | Python proxy server (dual-stack IPv4/IPv6) |
| `vercel.json` | 4 lines | Vercel static deploy config |
| `OMNIRUTE.md` | 24 lines | OmniRoute usage notes |

## OmniRoute Integration (Critical)

OmniRoute's `/v1/chat/completions` returns **SSE by default**. Browser `fetch()` cannot parse SSE as JSON.

**Always add `stream: false`**:
```javascript
fetch('http://127.0.0.1:20128/v1/chat/completions', {
  method: 'POST',
  body: JSON.stringify({
    model: 'auto/best-chat',
    stream: false,  // ← REQUIRED
    messages: [...]
  })
});
```

**Mixed content**: HTTPS pages (GitHub Pages) cannot call `http://localhost:20128`. Chat only works from local HTTP server (port 8765).

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Backend + OmniRoute status |
| GET | `/api/books` | List uploaded books |
| POST | `/api/upload` | Upload + extract PDF (all pages) |
| DELETE | `/api/books/:id` | Delete a book |
| POST | `/api/chat` | AI chat with optional book context |
| GET | `/api/search/:id?q=` | Keyword search in book chunks |

## ECN Specialties (16)

Cardiologie, Endocrinologie, Neurologie, Pneumologie, Gastro-entérologie, Oncologie, Maladies infectieuses, Rhumatologie, Néphrologie, Hématologie, Psychiatrie, Pédiatrie, Gynécologie-Obstétrique, Urgences-Réanimation, Pharmacologie, Biologie médicale.

## Running Locally

```bash
# Terminal 1: Node backend (separate project)
node index.js  # port 4000

# Terminal 2: Python proxy (this repo)
python3 server.py  # port 8765
```

Open http://localhost:8765

## Deployment

- **GitHub Pages**: Static only. URL: https://ia2213.github.io/med-tutor-ecn/
- **Vercel**: Static export via `vercel.json`
- **Full chat**: Requires local `server.py` + Node backend + OmniRoute

## Rules

- Frontend is vanilla HTML/JS — no framework, no build step
- All code in `index.html` (inline CSS + JS) — edit in-place
- Python server port 8765, Node backend port 4000 — don't change without updating both
- All UI text in French
- PDF max 100MB
- Book chunks stored as JSON in Node backend's `extracts/` directory

## Common Issues

| Problem | Cause | Fix |
|---------|-------|-----|
| SSE parsing error | Missing `stream: false` | Add it to OmniRoute request |
| Mixed content blocked | GitHub Pages is HTTPS | Use local http://localhost:8765 |
| Upload hangs | Node backend not running | Start Node backend on port 4000 |
| Books not loading | `extracts/` missing | Check Node backend storage |
