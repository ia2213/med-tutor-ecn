# Déploiement de MedTutor ECN

## Étape 1: Créer un repository GitHub

1. Allez sur https://github.com/new
2. Nom du repository: `med-tutor-ecn`
3. Public
4. Ne pas cocher "Add a README file"
5. Cliquez "Create repository"

## Étape 2: Push le code

Ouvrez un terminal et exécutez:

```bash
cd C:\Users\Marc Hopf\med-tutor\med-tutor

# Ajouter le remote (remplacez YOUR_USERNAME par votre pseudo GitHub)
git remote add origin https://github.com/YOUR_USERNAME/med-tutor-ecn.git

# Push
git push -u origin main
```

## Étape 3: Déployer sur Vercel

### Option A: Via la CLI
```bash
cd C:\Users\Marc Hopf\med-tutor\med-tutor
vercel --prod
```

### Option B: Via le dashboard
1. Allez sur https://vercel.com/new
2. Importez votre repository GitHub
3. Cliquez "Deploy"

## Étape 4: Configurer les variables d'environnement

Dans le dashboard Vercel, ajoutez:
- `OPENAI_API_KEY` = votre-clé-api-openai
- `OPENAI_BASE_URL` = https://api.openai.com/v1 (optionnel)
- `MODEL` = gpt-4o-mini (optionnel)

## Étape 5: GitHub Pages (alternative statique)

1. Dans votre repository GitHub: Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` avec dossier `/out`
4. Cliquez Save

Votre site sera disponible à:
- Vercel: `https://med-tutor-ecn.vercel.app`
- GitHub Pages: `https://YOUR_USERNAME.github.io/med-tutor-ecn/`
