# Comment utiliser MedTutor ECN avec OmniRoute

## 🎯 Le chat IA utilise OmniRoute local

Le site est configuré pour utiliser **OmniRoute** qui tourne sur votre machine locale (port 20128).

### Conditions
1. **OmniRoute doit être installé** sur votre machine
2. **Le serveur OmniRoute doit être démarré**:
   ```bash
   omniroute serve
   ```
3. Vérifier qu'OmniRoute répond:
   ```bash
   curl http://127.0.0.1:20128/v1/models
   ```

### Démarrage du server MedTutor
```bash
python server.py
```
Ouvrez http://localhost:8765

### GitHub Pages
Sur GitHub Pages (HTTPS), le chat ne fonctionne PAS car:
- Le navigateur ne peut pas atteindre `127.0.0.1:20128` (mixed content)
- Le server.py n'est pas déployé

**Solution**: utilisez la version locale avec `python server.py`

### Installation de pdftotext (Windows)
```bash
# Via Chocolatey
choco install poppler

# Ou via winget
winget install PopplerPoppler.Poppler
```
