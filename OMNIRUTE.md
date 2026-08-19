# Comment utiliser MedTutor ECN avec OmniRoute

## 🎯 Le chat IA utilise OmniRoute local

Le site est configuré pour utiliser **OmniRoute** qui tourne sur votre machine locale (port 20128).

### Conditions
1. **OmniRoute doit être installé** sur votre machine
2. **Le serveur OmniRoute doit être démarré**:
   ```bash
   omniroute serve
   ```
3. Le site fonctionne en local, mais sur GitHub Pages, l'appel API vers `127.0.0.1:20128` ne marchera pas depuis un navigateur distant.

### Solution pour GitHub Pages
Pour que le chat fonctionne sur GitHub Pages, il faut:
1. Soit utiliser une API externe (OpenAI, Groq, etc.)
2. Soit déployer le site en local avec un backend

### Alternative: Utiliser une API externe
Si OmniRoute n'est pas disponible, le site essaie de se connecter à:
- `http://127.0.0.1:20128/v1/chat/completions` (OmniRoute local)

Si ça ne marche pas, vous pouvez configurer une clé API OpenAI/Groq dans le code.
