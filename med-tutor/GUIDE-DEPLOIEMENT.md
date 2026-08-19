# MedTutor ECN - Instructions de Déploiement

## 📦 Votre projet est prêt !

**Dossier:** `C:\Users\Marc Hopf\med-tutor\med-tutor\`

---

## 🚀 Étapes pour mettre en ligne

### 1️⃣ Créer un repository GitHub

```
1. Ouvrez https://github.com/new
2. Nom: med-tutor-ecn
3. Public
4. PAS de README
5. Create repository
```

### 2️⃣ Push le code

```bash
cd C:\Users\Marc Hopf\med-tutor\med-tutor

git remote add origin https://github.com/VOTRE_USERNAME/med-tutor-ecn.git
git push -u origin main
```

### 3️⃣ Déployer sur Vercel (recommandé)

**Option A - CLI:**
```bash
cd C:\Users\Marc Hopf\med-tutor\med-tutor
vercel --prod
```

**Option B - Dashboard:**
1. Allez sur https://vercel.com/new
2. Importez votre repo GitHub `med-tutor-ecn`
3. Deploy

### 4️⃣ Configurer l'API OpenAI

Dans Vercel, ajoutez ces variables d'environnement:
```
OPENAI_API_KEY = sk-your-key-here
MODEL = gpt-4o-mini
```

---

## 📍 URLs après déploiement

| Plateforme | URL |
|------------|-----|
| Vercel | `https://med-tutor-ecn.vercel.app` |
| GitHub Pages | `https://VOTRE_USERNAME.github.io/med-tutor-ecn/` |

---

## ⚠️ Pour GitHub Pages (version statique)

Le site fonctionne sans API, mais le chat IA nécessitera Vercel.

Pour GitHub Pages:
1. Settings → Pages → Source: `main` / `/out`
2. Le workflow GitHub Actions déployera automatiquement

---

## 🔑 Clé API OpenAI

Obtenez votre clé ici: https://platform.openai.com/api-keys

Options moins chères:
- **Groq**: `https://api.groq.com/openai/v1` avec modèle `llama-3.3-70b-versatile`
- **Azure OpenAI**: Configurez `OPENAI_BASE_URL`
