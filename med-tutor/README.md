# MedTutor ECN - Tuteur Médical IA pour l'ECN Français

Un site web pour tutorer les étudiants en médecine préparant l'ECN (Épreuves Classantes Nationales) en France.

## Fonctionnalités

- **Upload de livres PDF** - Analysez vos manuels de médecine
- **Chat IA** - Posez des questions et recevez des réponses
- **Spécialités ECN R2C** - 16 pré-réglages pour les matières clés
- **DeepTutor + book-to-skill** - Technologie open-source

## Déploiement

### Option 1: Vercel (Recommandé - avec API)
```bash
# Déployer sur Vercel
vercel --prod
```
Configurer les variables d'environnement dans Vercel:
- `OPENAI_API_KEY`
- `OPENAI_BASE_URL` (optionnel)
- `MODEL` (optionnel)

### Option 2: GitHub Pages (Statique)
```bash
# Build statique
npm run build
# Le dossier out/ contient le site statique
# Uploadez sur GitHub Pages
```

## Configuration

Créez un fichier `.env.local`:
```bash
OPENAI_API_KEY=your-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
MODEL=gpt-4o-mini
```

Pour Groq (moins cher):
```bash
OPENAI_BASE_URL=https://api.groq.com/openai/v1
MODEL=llama-3.3-70b-versatile
```

## Liens

- [DeepTutor](https://github.com/HKUDS/DeepTutor)
- [book-to-skill](https://github.com/virgiliojr94/book-to-skill)
- [ECN France](https://www.etudes-et-concours.gouv.fr/)
