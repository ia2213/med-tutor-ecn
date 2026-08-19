# ✅ Déploiement en cours !

## GitHub Pages
Votre repository est sur GitHub: **https://github.com/ia2213/med-tutor-ecn**

Le workflow GitHub Actions va build et déployer automatiquement.
Cela prend environ 2-3 minutes.

**URL GitHub Pages:**
```
https://ia2213.github.io/med-tutor-ecn/
```

---

## Vercel (Recommandé pour le chat IA)

Le site est fonctionnel sur GitHub Pages (version statique), mais pour le **chat IA**, vous avez besoin de Vercel.

### Option 1: Dashboard Vercel (recommandé)
1. Allez sur **https://vercel.com/new**
2. Importez votre repository **ia2213/med-tutor-ecn**
3. Cliquez **Deploy**
4. Dans Settings → Environment Variables, ajoutez:
   - `OPENAI_API_KEY` = votre clé API OpenAI

### Option 2: Via la CLI
```bash
# Connectez Vercel
vercel login

# Déployez
cd C:\Users\Marc Hopf\med-tutor\med-tutor
vercel --prod
```

---

## 📊 Statut actuel

| Service | Statut | URL |
|---------|--------|-----|
| GitHub | ✅ Pushé | https://github.com/ia2213/med-tutor-ecn |
| GitHub Pages | 🔄 En cours | https://ia2213.github.io/med-tutor-ecn/ |
| Vercel | ❌ Nécessite login | https://med-tutor-ecn.vercel.app |

---

## 🔑 Prochaines étapes

1. **Patientez 2-3 minutes** pour le déploiement GitHub Pages
2. **Connectez Vercel** pour le chat IA:
   - Option A: https://vercel.com/new → Import repo
   - Option B: `vercel login` puis `vercel --prod`
3. **Ajoutez votre clé API** dans Vercel Settings

---

**Votre site sera live très bientôt !** 🚀
