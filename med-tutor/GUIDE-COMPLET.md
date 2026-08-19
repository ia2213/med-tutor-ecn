# MedTutor ECN - Guide Complet

## ✅ Projet Créé

Votre site MedTutor ECN est prêt dans:
```
C:\Users\Marc Hopf\med-tutor\med-tutor\
```

---

## 🚀 Déploiement en 3 étapes

### Étape 1: Créer un repository GitHub

1. Ouvrez https://github.com/new
2. **Repository name**: `med-tutor-ecn`
3. **Public**
4. **Ne pas cocher** "Add a README file"
5. Cliquez **Create repository**

### Étape 2: Push le code

Ouvrez PowerShell ou Git Bash et exécutez:

```bash
cd C:\Users\Marc Hopf\med-tutor\med-tutor

# Ajouter le remote (remplacez VOTRE_USERNAME)
git remote add origin https://github.com/VOTRE_USERNAME/med-tutor-ecn.git

# Push
git push -u origin main
```

### Étape 3: Déployer sur Vercel

**Option A - Dashboard (recommandé):**
1. Allez sur https://vercel.com/new
2. Importez votre repository `med-tutor-ecn`
3. Cliquez **Deploy**

**Option B - CLI:**
```bash
cd C:\Users\Marc Hopf\med-tutor\med-tutor
vercel --prod
```

---

## 🔑 Configuration API

Après le déploiement, ajoutez ces variables dans Vercel:

| Variable | Valeur |
|----------|--------|
| `OPENAI_API_KEY` | `sk-...` (votre clé OpenAI) |
| `MODEL` | `gpt-4o-mini` (optionnel) |

**Option moins chère - Groq:**
| Variable | Valeur |
|----------|--------|
| `OPENAI_API_KEY` | `gsk-...` (clé Groq) |
| `OPENAI_BASE_URL` | `https://api.groq.com/openai/v1` |
| `MODEL` | `llama-3.3-70b-versatile` |

---

## 🌐 URLs

Après déploiement:

| Plateforme | URL |
|------------|-----|
| **Vercel** | `https://med-tutor-ecn.vercel.app` |
| **GitHub Pages** | `https://VOTRE_USERNAME.github.io/med-tutor-ecn/` |

---

## 📱 Fonctionnalités

- ✅ Upload de PDF (analyse côté client)
- ✅ 16 spécialités ECN R2C
- ✅ Chat IA (nécessite API key)
- ✅ Responsive design
- ✅ Déploiement automatique GitHub Pages

---

## 📂 Structure du projet

```
med-tutor/
├── src/
│   ├── app/
│   │   ├── page.tsx      # Interface principale
│   │   ├── globals.css   # Styles
│   │   └── layout.tsx    # Layout
│   └── lib/
│       ├── ecn-presets.ts    # 16 spécialités
│       ├── pdf-extractor.ts  # Parsing PDF
│       └── chat-api.ts       # API LLM
├── .github/workflows/
│   └── deploy-pages.yml  # Auto-deploy
└── vercel.json           # Config Vercel
```

---

## 🔧 Technologies

- **Frontend**: Next.js 15 + React 19
- **PDF**: pdfjs-dist
- **IA**: OpenAI API (compatible Groq/Azure)
- **Déploiement**: Vercel + GitHub Pages
