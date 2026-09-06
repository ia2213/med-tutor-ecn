#!/usr/bin/env python3
"""
MedTutor ECN — Server autonome (plus besoin de Node backend)
- Sert le frontend statique sur le port spécifié
- Extrait les PDFs avec pdftotext (taille illimitée)
- Chat IA directement via OmniRoute (port 20128)
- Stockage local des livres dans ./books/
- Thread-safe: Health check ne bloque pas les autres requêtes
"""
import sys
import os
import json
import uuid
import shutil
import subprocess
import re
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn
import socket
import threading
from urllib.parse import urlparse, parse_qs

OMNIROUTE_PORT = 20128
OMNIROUTE_URL = f"http://127.0.0.1:{OMNIROUTE_PORT}"
BOOKS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "books")

# Cache OmniRoute health status
_omni_healthy = None
_omni_last_check = 0

def check_omniroute():
    """Check if OmniRoute is available (cache result for 30s, but failures reset faster)."""
    global _omni_healthy, _omni_last_check
    import time
    now = time.time()
    # If cached as healthy, return it (30s TTL)
    if _omni_healthy is True and now - _omni_last_check < 30:
        return True
    # Try fresh check
    try:
        import urllib.request
        req = urllib.request.Request(f"{OMNIROUTE_URL}/v1/models")
        with urllib.request.urlopen(req, timeout=15) as resp:
            if resp.status == 200:
                _omni_healthy = True
                _omni_last_check = now
                return True
    except Exception:
        pass
    # If we get here, either failed or stale cache - do another check
    if _omni_healthy is False and now - _omni_last_check < 5:
        return False  # Don't spam checks
    try:
        import urllib.request
        req = urllib.request.Request(f"{OMNIROUTE_URL}/v1/models")
        with urllib.request.urlopen(req, timeout=15) as resp:
            if resp.status == 200:
                _omni_healthy = True
            else:
                _omni_healthy = False
    except Exception:
        _omni_healthy = False
    _omni_last_check = now
    return _omni_healthy

# === SPécialités ECN ===
SPECIALTIES = {
    "cardio": {"name": "Cardiologie", "icon": "❤️", "prompt": "Tu es un professeur de cardiologie pour étudiants en médecine français préparant l'ECN/R2C. Réponds de manière pédagogique, structurée, avec les points clés à retenir pour l'examen. Utilise un français médical précis."},
    "endo": {"name": "Endocrinologie", "icon": "🦋", "prompt": "Tu es un professeur d'endocrinologie pour étudiants en médecine français préparant l'ECN/R2C. Réponds de manière pédagogique, structurée, avec les points clés à retenir pour l'examen. Utilise un français médical précis."},
    "neuro": {"name": "Neurologie", "icon": "🧠", "prompt": "Tu es un professeur de neurologie pour étudiants en médecine français préparant l'ECN/R2C. Réponds de manière pédagogique, structurée, avec les points clés à retenir pour l'examen. Utilise un français médical précis."},
    "pnea": {"name": "Pneumologie", "icon": "🫁", "prompt": "Tu es un professeur de pneumologie pour étudiants en médecine français préparant l'ECN/R2C. Réponds de manière pédagogique, structurée, avec les points clés à retenir pour l'examen. Utilise un français médical précis."},
    "gastro": {"name": "Gastro-entérologie", "icon": "🫀", "prompt": "Tu es un professeur de gastro-entérologie pour étudiants en médecine français préparant l'ECN/R2C. Réponds de manière pédagogique, structurée, avec les points clés à retenir pour l'examen. Utilise un français médical précis."},
    "onco": {"name": "Oncologie", "icon": "🎗️", "prompt": "Tu es un professeur d'oncologie pour étudiants en médecine français préparant l'ECN/R2C. Réponds de manière pédagogique, structurée, avec les points clés à retenir pour l'examen. Utilise un français médical précis."},
    "infect": {"name": "Maladies infectieuses", "icon": "🦠", "prompt": "Tu es un professeur de maladies infectieuses pour étudiants en médecine français préparant l'ECN/R2C. Réponds de manière pédagogique, structurée, avec les points clés à retenir pour l'examen. Utilise un français médical précis."},
    "rehab": {"name": "Rhumatologie", "icon": "🦴", "prompt": "Tu es un professeur de rhumatologie pour étudiants en médecine français préparant l'ECN/R2C. Réponds de manière pédagogique, structurée, avec les points clés à retenir pour l'examen. Utilise un français médical précis."},
    "nephro": {"name": "Néphrologie", "icon": "🫘", "prompt": "Tu es un professeur de néphrologie pour étudiants en médecine français préparant l'ECN/R2C. Réponds de manière pédagogique, structurée, avec les points clés à retenir pour l'examen. Utilise un français médical précis."},
    "hemato": {"name": "Hématologie", "icon": "🩸", "prompt": "Tu es un professeur d'hématologie pour étudiants en médecine français préparant l'ECN/R2C. Réponds de manière pédagogique, structurée, avec les points clés à retenir pour l'examen. Utilise un français médical précis."},
    "psy": {"name": "Psychiatrie", "icon": "🧠", "prompt": "Tu es un professeur de psychiatrie pour étudiants en médecine français préparant l'ECN/R2C. Réponds de manière pédagogique, structurée, avec les points clés à retenir pour l'examen. Utilise un français médical précis."},
    "pedi": {"name": "Pédiatrie", "icon": "👶", "prompt": "Tu es un professeur de pédiatrie pour étudiants en médecine français préparant l'ECN/R2C. Réponds de manière pédagogique, structurée, avec les points clés à retenir pour l'examen. Utilise un français médical précis."},
    "gyn": {"name": "Gynécologie-Obstétrique", "icon": "🤰", "prompt": "Tu es un professeur de gynécologie-obstétrique pour étudiants en médecine français préparant l'ECN/R2C. Réponds de manière pédagogique, structurée, avec les points clés à retenir pour l'examen. Utilise un français médical précis."},
    "urg": {"name": "Urgences-Réanimation", "icon": "🚨", "prompt": "Tu es un professeur de réanimation-médecine d'urgence pour étudiants en médecine français préparant l'ECN/R2C. Réponds de manière pédagogique, structurée, avec les points clés à retenir pour l'examen. Utilise un français médical précis."},
    "pharma": {"name": "Pharmacologie", "icon": "💊", "prompt": "Tu es un professeur de pharmacologie pour étudiants en médecine français préparant l'ECN/R2C. Réponds de manière pédagogique, structurée, avec les points clés à retenir pour l'examen. Utilise un français médical précis."},
    "bio": {"name": "Biologie médicale", "icon": "🔬", "prompt": "Tu es un professeur de biologie médicale pour étudiants en médecine français préparant l'ECN/R2C. Réponds de manière pédagogique, structurée, avec les points clés à retenir pour l'examen. Utilise un français médical précis."},
}

DEFAULT_PROMPT = "Tu es un tuteur médical pour étudiants en médecine français préparant l'ECN/R2C. Réponds de manière pédagogique, structurée, avec les points clés à retenir pour l'examen. Utilise un français médical précis."

os.makedirs(BOOKS_DIR, exist_ok=True)


def extract_pdf_text(pdf_path, book_id):
    """Extraire le texte d'un PDF avec pdftotext et le découper en chunks."""
    out_dir = os.path.join(BOOKS_DIR, book_id)
    os.makedirs(out_dir, exist_ok=True)

    # Extraire le texte
    txt_path = os.path.join(out_dir, "text.txt")
    try:
        result = subprocess.run(
            ["pdftotext", "-layout", pdf_path, txt_path],
            capture_output=True, text=True, timeout=300
        )
        if result.returncode != 0:
            # Essayer sans -layout si ça échoue
            result = subprocess.run(
                ["pdftotext", pdf_path, txt_path],
                capture_output=True, text=True, timeout=300
            )
    except Exception as e:
        return None, str(e)

    if not os.path.exists(txt_path):
        return None, "Extraction failed"

    with open(txt_path, "r", encoding="utf-8", errors="ignore") as f:
        full_text = f.read()

    total_chars = len(full_text)

    # Découper en chunks de 4000 chars max
    chunks = []
    lines = full_text.split("\n")
    current_chunk = ""
    for line in lines:
        if len(current_chunk) + len(line) + 1 > 4000 and current_chunk:
            chunks.append(current_chunk.strip())
            current_chunk = line + "\n"
        else:
            current_chunk += line + "\n"
    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    # Compter les pages (approximation)
    page_count = max(1, len(chunks) // 5)  # ~5 chunks par page en moyenne

    # Sauvegarder les chunks
    chunks_file = os.path.join(out_dir, "chunks.json")
    with open(chunks_file, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False)

    return {
        "bookId": book_id,
        "title": os.path.basename(pdf_path).replace(".pdf", ""),
        "totalPages": page_count,
        "totalChars": total_chars,
        "chunkCount": len(chunks),
        "extractedPages": page_count,
    }, None


def search_chunks(chunks, query, top_n=3):
    """Rechercher les chunks les plus pertinents pour une requête."""
    words = query.lower().split()
    results = []
    for i, chunk in enumerate(chunks):
        score = sum(chunk.lower().count(w) for w in words)
        if score > 0:
            results.append((score, chunk))
    results.sort(reverse=True)
    return [r[1] for r in results[:top_n]]


def call_omniroute(messages, max_tokens=2000):
    """Appeler OmniRoute pour générer une réponse."""
    import urllib.request
    import urllib.error
    
    body = json.dumps({
        "model": "auto/best-chat",
        "stream": False,
        "messages": messages,
        "max_tokens": max_tokens,
    }).encode("utf-8")
    
    try:
        req = urllib.request.Request(
            f"{OMNIROUTE_URL}/v1/chat/completions",
            data=body,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
            return data["choices"][0]["message"]["content"]
    except urllib.error.URLError as e:
        return f"Erreur OmniRoute: {e}"
    except Exception as e:
        return f"Erreur API: {e}"


class MedTutorHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.start_time = None
        super().__init__(*args, **kwargs)

    def log_message(self, format, *args):
        # Logs silencieux pour réduire le bruit
        pass
    
    def do_GET(self):
        if self.path.startswith("/api/"):
            if self.path == "/api/health":
                return self._health()
            elif self.path == "/api/books":
                return self._list_books()
            elif self.path.startswith("/api/search/"):
                return self._search()
            else:
                self._json_response({"error": "Not found"}, 404)
        else:
            # Servir les fichiers statiques
            if self.path == "/" or self.path == "/index.html":
                self.path = "/index.html"
            return super().do_GET()
    
    def do_POST(self):
        if self.path.startswith("/api/"):
            if self.path == "/api/upload":
                return self._upload()
            elif self.path == "/api/chat":
                return self._chat()
            else:
                self._json_response({"error": "Not found"}, 404)
        else:
            self.send_error(404)
    
    def do_DELETE(self):
        if self.path.startswith("/api/books/"):
            book_id = self.path.split("/api/books/")[1].split("?")[0]
            return self._delete_book(book_id)
        self._json_response({"error": "Not found"}, 404)
    
    def _health(self):
        # Vérifier OmniRoute (sans cache pour le health check)
        import time
        global _omni_healthy, _omni_last_check
        omni_ok = False
        try:
            import urllib.request
            req = urllib.request.Request(f"{OMNIROUTE_URL}/v1/models")
            with urllib.request.urlopen(req, timeout=45) as resp:
                if resp.status == 200:
                    omni_ok = True
                    _omni_healthy = True
                    _omni_last_check = time.time()
        except Exception:
            pass
        self._json_response({"status": "ok", "omniroute": omni_ok, "books_count": len(self._get_books()), "version": "3.0"})
    
    def _list_books(self):
        books = self._get_books()
        self._json_response({"books": books})
    
    def _get_books(self):
        books = []
        if os.path.exists(BOOKS_DIR):
            for entry in os.listdir(BOOKS_DIR):
                book_dir = os.path.join(BOOKS_DIR, entry)
                if os.path.isdir(book_dir):
                    chunks_file = os.path.join(book_dir, "chunks.json")
                    meta_file = os.path.join(book_dir, "meta.json")
                    if os.path.exists(chunks_file):
                        with open(chunks_file, "r") as f:
                            chunks = json.load(f)
                        meta = {}
                        if os.path.exists(meta_file):
                            with open(meta_file, "r") as f:
                                meta = json.load(f)
                        books.append({
                            "bookId": entry,
                            "title": meta.get("title", entry),
                            "totalPages": meta.get("totalPages", len(chunks) // 5),
                            "totalChars": meta.get("totalChars", sum(len(c) for c in chunks)),
                            "chunkCount": len(chunks),
                            "extractedPages": meta.get("extractedPages", len(chunks) // 5),
                        })
        return books
    
    def _upload(self):
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length == 0:
            self._json_response({"error": "Aucun fichier reçu"}, 400)
            return

        # Lire le fichier PDF
        pdf_data = self.rfile.read(content_length)
        
        # Trouver le nom du fichier dans les headers
        content_disposition = self.headers.get("Content-Disposition", "")
        filename = "upload.pdf"
        if "filename=" in content_disposition:
            filename = content_disposition.split("filename=")[1].strip('"')
        
        book_id = str(uuid.uuid4())
        pdf_path = os.path.join(BOOKS_DIR, book_id, "original.pdf")
        os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
        
        with open(pdf_path, "wb") as f:
            f.write(pdf_data)
        
        # Extraire le texte
        result, error = extract_pdf_text(pdf_path, book_id)
        
        if error:
            self._json_response({"error": f"Extraction PDF échouée: {error}"}, 500)
            return
        
        # Sauvegarder les métadonnées
        meta_file = os.path.join(BOOKS_DIR, book_id, "meta.json")
        with open(meta_file, "w") as f:
            json.dump(result, f)
        
        self._json_response({
            "success": True,
            "bookId": book_id,
            "title": result["title"],
            "totalPages": result["totalPages"],
            "extractedPages": result["extractedPages"],
            "totalChars": result["totalChars"],
            "chunkCount": result["chunkCount"],
        })
    
    def _search(self):
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)
        book_id = parsed.path.split("/api/search/")[1].split("?")[0]
        query = params.get("q", [""])[0]
        
        chunks_file = os.path.join(BOOKS_DIR, book_id, "chunks.json")
        if not os.path.exists(chunks_file):
            self._json_response({"error": "Livre non trouvé"}, 404)
            return
        
        with open(chunks_file, "r") as f:
            chunks = json.load(f)
        
        results = search_chunks(chunks, query)
        self._json_response({"results": results, "count": len(results)})
    
    def _chat(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(content_length))
        
        message = body.get("message", "")
        book_id = body.get("bookId")
        speciality = body.get("speciality")
        
        if not message:
            self._json_response({"error": "Message vide"}, 400)
            return
        
        # Construire le contexte
        context = ""
        if book_id:
            chunks_file = os.path.join(BOOKS_DIR, book_id, "chunks.json")
            if os.path.exists(chunks_file):
                with open(chunks_file, "r") as f:
                    chunks = json.load(f)
                relevant = search_chunks(chunks, message, top_n=5)
                if relevant:
                    context = "Documents pertinents du livre:\n" + "\n---\n".join(relevant) + "\n\n"
        
        # Système
        spec = SPECIALTIES.get(speciality, {}) if speciality else {}
        system_prompt = spec.get("prompt", DEFAULT_PROMPT)
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"{context}Question: {message}"}
        ]
        
        answer = call_omniroute(messages)
        self._json_response({"answer": answer})
    
    def _delete_book(self, book_id):
        book_dir = os.path.join(BOOKS_DIR, book_id)
        if os.path.exists(book_dir):
            shutil.rmtree(book_dir)
            self._json_response({"success": True})
        else:
            self._json_response({"error": "Livre non trouvé"}, 404)
    
    def _json_response(self, data, status=200):
        response = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.end_headers()
        self.wfile.write(response)
    
    def log_message(self, format, *args):
        pass  # Silencer les logs


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Server multi-threadé: health check ne bloque pas les uploads/chat."""
    daemon_threads = True


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    server = ThreadedHTTPServer(("0.0.0.0", port), MedTutorHandler)
    print("=" * 50)
    print("  MedTutor ECN - Server Autonome v3.1 (Threaded)")
    print("=" * 50)
    print(f"  Frontend:  http://localhost:{port}")
    print(f"  OmniRoute: http://127.0.0.1:{OMNIROUTE_PORT}")
    print(f"  Books:     {BOOKS_DIR}")
    print("=" * 50)
    print(f"\n  Open http://localhost:{port} in your browser\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        server.shutdown()
    print(f"  OmniRoute: http://localhost:{OMNIROUTE_PORT}")
    print(f"  Books:     {BOOKS_DIR}")
    print(f"{'='*50}")
    print(f"\n  Open http://localhost:{PORT} in your browser\n")
    
    try:
        server = DualStackServer(PORT)
        server.start()
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServer stopped.")
        server.server_close()
