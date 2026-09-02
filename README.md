# MedTutor ECN — Tuteur Médical IA

## 🌐 Site en ligne !

**URL:** https://ia2213.github.io/med-tutor-ecn/

---

## ✅ Déploiement réussi !

Le site est déployé sur **GitHub Pages** et fonctionne parfaitement !

---

## 🎯 Fonctionnalités

- ✅ **Chat IA gratuit** — Utilise OmniRoute local (pas de clé API)
- ✅ **16 spécialités ECN R2C** — Toutes les matières couvertes
- ✅ **Upload PDF** — Chargez vos livres de médecine
- ✅ **Réponses en français** — Pédagogique et structuré
- ✅ **Server autonome v3.0** — Plus besoin de Node backend

---

## 📝 Comment utiliser

### En local (recommandé pour le chat)

```bash
# 1. Vérifier qu'OmniRoute tourne
curl http://127.0.0.1:20128/v1/models

# 2. Démarrer le server
python server.py

# 3. Ouvrir dans le navigateur
# http://localhost:8765
```

### Sur GitHub Pages (UI seulement)

Le site est visible sur https://ia2213.github.io/med-tutor-ecn/
Mais le chat nécessite OmniRoute local → utilisez la version locale.

---

## 🔧 Configuration

| Service | Port | Statut |
|---------|------|--------|
| Frontend (server.py) | 8765 | ✅ |
| OmniRoute | 20128 | ✅ |
| Livres stockés | ./books/ | ✅ |

---

## 📊 Statut

| Service | URL | Statut |
|---------|-----|--------|
| **GitHub Pages** | https://ia2213.github.io/med-tutor-ecn/ | ✅ En ligne |
| **GitHub Repo** | https://github.com/ia2213/med-tutor-ecn | ✅ Pushé |
| **Server local** | http://localhost:8765 | 🔧 Voir ci-dessus |

---

## 🚀 Démarrage rapide

```bash
# Installer les dépendances (déjà incluses)
# pdftotext (poppler) — vérification
pdftotext -v

# Lancer le server
python server.py
```

---

**Propulsé par OmniRoute + pdftotext** 🎓
