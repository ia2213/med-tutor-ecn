# Résumé du Déploiement

## ✅ Ce qui est prêt

Votre projet MedTutor ECN est complet dans:
```
C:\Users\Marc Hopf\med-tutor\med-tutor\
```

## ⚠️ Problème avec le token GitHub

Votre token n'a pas les permissions pour créer des repositories.

### Option 1: Mettre à jour le token (recommandé)

1. Allez sur https://github.com/settings/tokens
2. Trouvez votre token
3. Cochez: **repo** (full access)
4. Sauvegardez
5. Redonnez-moi le nouveau token

### Option 2: Déploiement manuel

```bash
# Créer le repo sur GitHub (via le site web)
# Puis:
cd C:\Users\Marc Hopf\med-tutor\med-tutor
git remote add origin https://github.com/ia2213/med-tutor-ecn.git
git push -u origin main
```

### Option 3: Installer GitHub CLI

```bash
# Installer gh
winget install GitHub.cli

# S'authentifier
gh auth login
# Suivez les instructions

# Créer le repo et push
gh repo create med-tutor-ecn --public
cd C:\Users\Marc Hopf\med-tutor\med-tutor
git push -u origin main
```

## 🚀 Après le push sur GitHub

### Déployer sur Vercel

**Option A - Dashboard:**
1. Allez sur https://vercel.com/new
2. Importez `ia2213/med-tutor-ecn`
3. Deploy

**Option B - CLI:**
```bash
cd C:\Users\Marc Hopf\med-tutor\med-tutor
vercel --prod
```

### Configurer l'API

Dans Vercel → Settings → Environment Variables:
```
OPENAI_API_KEY=sk-...
```

---

## 🌐 URLs finales

- **Vercel:** `https://med-tutor-ecn.vercel.app`
- **GitHub Pages:** `https://ia2213.github.io/med-tutor-ecn/`

---

## 📁 Fichiers importants

| Fichier | Description |
|---------|-------------|
| `src/app/page.tsx` | Interface principale |
| `src/lib/ecn-presets.ts` | 16 spécialités ECN R2C |
| `.github/workflows/deploy-pages.yml` | Auto-déploiement |
| `vercel.json` | Config Vercel |

---

**Dites-moi quand vous avez un nouveau token avec les bonnes permissions !**
