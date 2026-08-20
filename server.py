#!/usr/bin/env python3
"""
MedTutor - Simple HTTP server with API proxy to Node backend
Usage: python server.py [port]
"""
import sys
import os
import json
import urllib.request
import urllib.error
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

BACKEND_PORT = 4000
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class ProxyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/api/'):
            return self._proxy_request('GET')
        return super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/'):
            return self._proxy_request('POST')
        self.send_error(404)

    def do_DELETE(self):
        if self.path.startswith('/api/'):
            return self._proxy_request('DELETE')
        self.send_error(404)

    def _proxy_request(self, method):
        """Proxy API request to Node backend"""
        body = None
        if method == 'POST':
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                body = self.rfile.read(content_length)

        # Build the target URL
        target_url = f'http://127.0.0.1:{BACKEND_PORT}{self.path}'
        
        try:
            req = urllib.request.Request(target_url, data=body, method=method)
            req.add_header('Content-Type', 'application/json')
            req.add_header('Accept', 'application/json')
            
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = resp.read()
                self.send_response(resp.status)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()
                self.wfile.write(data)
        except urllib.error.HTTPError as e:
            error_data = e.read()
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(error_data)
        except Exception as e:
            self.send_error(500, f"Proxy error: {str(e)}")

    def log_message(self, format, *args):
        """Suppress default logging"""
        pass

if __name__ == '__main__':
    os.chdir(BASE_DIR)
    server = HTTPServer(('0.0.0.0', PORT), ProxyHandler)
    print(f"\n{'='*50}")
    print(f"  MedTutor ECN - Local Server")
    print(f"{'='*50}")
    print(f"  Frontend:  http://localhost:{PORT}")
    print(f"  Backend:   http://localhost:{BACKEND_PORT}")
    print(f"  OmniRoute: http://localhost:20128")
    print(f"{'='*50}")
    print(f"\n  Open http://localhost:{PORT} in your browser\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServer stopped.")
        server.server_close()
