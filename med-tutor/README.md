# MedTutor ECN - Site en ligne ! 🚀

## ✅ Déploiement réussi !

**Repository:** https://github.com/ia2213/med-tutor-ecn

**GitHub Pages:** https://ia2213.github.io/med-tutor-ecn/

---

## 🌐 Votre site est maintenant en ligne !

Le site est déployé sur GitHub Pages avec le workflow automatique.

**URL:** https://ia2213.github.io/med-tutor-ecn/

---

## 📊 Statut

| Composant | Statut |
|-----------|--------|
| GitHub Repository | ✅ Pushé |
| GitHub Pages | ✅ Déployé |
| Workflow Actions | ✅ Terminé |

---

## 🔧 Pour le chat IA (version complète)

La version GitHub Pages est **statique** - le chat nécessite une API.

### Option 1: Déployer sur Vercel (recommandé)

1. Allez sur **https://vercel.com/new**
2. Importez votre repository **ia2213/med-tutor-ecn**
3. Cliquez **Deploy**
4. Ajoutez la variable d'environnement:
   - `OPENAI_API_KEY` = votre clé API OpenAI

### Option 2: Utiliser GitHub Pages + API externe

Vous pouvez utiliser l'API de DeepTutor directement:
- https://deeptutor.info/
- Configurez votre clé API dans le code

---

## 📁 Structure du projet

```
med-tutor/
├── src/
│   ├── app/
│   │   ├── page.tsx      # Interface principale
│   │   ├── globals.css   # Styles
│   │   └── layout.tsx    # Layout
│   └── lib/
│       ├── ecn-presets.ts    # 16 spécialités ECN
│       ├── pdf-extractor.ts  # Parsing PDF
│       └── chat-api.ts       # API LLM
├── .github/workflows/
│   └── deploy-pages.yml  # Auto-déploiement
└── vercel.json           # Config Vercel
```

---

## 🎯 Fonctionnalités

- ✅ Upload de PDF
- ✅ 16 spécialités ECN R2C
- ✅ Interface chat
- ✅ Design responsive
- ✅ Déploiement automatique

---

## 🔑 Pour activer le chat IA

Ajoutez votre clé API OpenAI:

```bash
# Dans Vercel (recommandé)
# Settings → Environment Variables
OPENAI_API_KEY=sk-***

# Ou dans .env.local (local)
OPENAI_API_KEY=sk-***
OPENAI_BASE_URL=https://api.openai.com/v1
MODEL=gpt-4o-mini
```

---

**Votre site est en ligne ! 🎉**
