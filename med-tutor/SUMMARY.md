# MedTutor ECN - Résumé

## ✅ Projet créé avec succès

**Emplacement:** `C:\Users\Marc Hopf\med-tutor\med-tutor\`

### Fonctionnalités
- 📄 Upload de livres PDF avec extraction de texte
- 💬 Interface de chat pour poser des questions
- 🎯 16 spécialités ECN R2C pré-configurées
- 🤖 Integration avec DeepTutor + book-to-skill

### Stack
- Next.js 15 (App Router) + React 19
- pdfjs-dist pour la parsing PDF
- OpenAI API pour le tutorat IA

### Déploiement

#### GitHub Pages (Statique)
```bash
# 1. Créez un repo GitHub
# 2. Push le code:
git remote add origin https://github.com/VOTRE_USER/med-tutor-ecn.git
git push -u origin main

# 3. Activez GitHub Pages dans Settings → Pages
#    Source: Deploy from a branch → main / out/
```

#### Vercel (Avec API)
```bash
# Connectez votre repo GitHub et déployez:
vercel --prod

# Ou via le dashboard Vercel
# Ajoutez la variable d'environnement:
OPENAI_API_KEY=votre-clé-api
```

### Configuration
Créez `.env.local`:
```bash
OPENAI_API_KEY=your-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
MODEL=gpt-4o-mini
```

### Structure du projet
```
med-tutor/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Page principale
│   │   ├── globals.css       # Styles
│   │   └── layout.tsx        # Layout
│   └── lib/
│       ├── ecn-presets.ts    # 16 spécialités ECN
│       ├── pdf-extractor.ts  # Parsing PDF
│       └── chat-api.ts       # API LLM
├── .github/workflows/
│   └── deploy-pages.yml      # GitHub Actions
├── vercel.json               # Config Vercel
└── package.json
```

### Prochaines étapes
1. Créez un compte GitHub si nécessaire
2. Créez un nouveau repository
3. Push le code avec `git push`
4. Déployez sur Vercel pour les fonctionnalités complètes
5. Ou déployez sur GitHub Pages pour une version statique
