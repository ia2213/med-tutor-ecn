# Guide de Déploiement - MedTutor ECN

## ⚠️ Problème avec le token GitHub

Votre token actuel n'a pas les permissions nécessaires pour:
- Créer de nouveaux repositories
- Push du code

## 🔧 Solution: Mettre à jour le token

1. Allez sur **https://github.com/settings/tokens**
2. Trouvez votre token (celui que vous avez fourni)
3. Cliquez **"Edit"**
4. Cochez ces permissions:
   - ✅ **repo** (full repository access)
   - ✅ **workflow** (GitHub Actions)
   - ✅ **read:org** (optionnel)
5. Cliquez **"Update token"**
6. Copiez le nouveau token

## 🚀 Après mise à jour du token

Dites-moi le nouveau token et je continuerai le déploiement.

Ou faites-le manuellement:

```bash
# 1. Créer le repository sur GitHub (via le site)
# 2. Push le code
cd C:\Users\Marc Hopf\med-tutor\med-tutor
git remote set-url origin https://github.com/ia2213/med-tutor-ecn.git
git push -u origin main

# 3. Déployer sur Vercel
vercel --prod
```
