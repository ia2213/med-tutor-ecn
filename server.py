#!/usr/bin/env python3
"""
MedTutor - Simple HTTP server with API proxy to Node backend
Supports both IPv4 and IPv6 (DualStack)
Usage: python server.py [port]
"""
import sys
import os
import json
import urllib.request
import urllib.error
from http.server import HTTPServer, SimpleHTTPRequestHandler
import socket
import threading

BACKEND_PORT = 4000
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class DualStackServer:
    """Support both IPv4 and IPv6 simultaneously"""
    def __init__(self, port):
        self.port = port
        self.servers = []
        self.threads = []
        
    def start(self):
        # Start IPv4 server
        try:
            s4 = HTTPServer(('0.0.0.0', self.port), ProxyHandler)
            t4 = threading.Thread(target=s4.serve_forever, daemon=True)
            t4.start()
            self.servers.append(s4)
            self.threads.append(t4)
            print(f"  IPv4: http://0.0.0.0:{self.port}")
        except Exception as e:
            print(f"  IPv4 failed: {e}")
        
        # Start IPv6 server
        try:
            s6 = HTTPServer(('::', self.port), ProxyHandler)
            s6.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 1)
            t6 = threading.Thread(target=s6.serve_forever, daemon=True)
            t6.start()
            self.servers.append(s6)
            self.threads.append(t6)
            print(f"  IPv6: http://[::]:{self.port}")
        except Exception as e:
            print(f"  IPv6 failed: {e}")
        
        if not self.servers:
            raise RuntimeError("Failed to start any server")
            
    def serve_forever(self):
        import time
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            for s in self.servers:
                s.shutdown()
    
    def server_close(self):
        for s in self.servers:
            s.server_close()

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

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def _proxy_request(self, method):
        body = None
        if method == 'POST':
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                body = self.rfile.read(content_length)

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
                self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                self.end_headers()
                self.wfile.write(data)
        except urllib.error.HTTPError as e:
            error_data = e.read()
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(error_data)
        except Exception as e:
            error_msg = json.dumps({'error': str(e)}).encode()
            self.send_response(502)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(error_msg)

    def log_message(self, format, *args):
        pass

if __name__ == '__main__':
    os.chdir(BASE_DIR)
    server = DualStackServer(PORT)
    print(f"\n{'='*50}")
    print(f"  MedTutor ECN - Local Server")
    print(f"{'='*50}")
    print(f"  Frontend:  http://localhost:{PORT}")
    print(f"  Backend:   http://localhost:{BACKEND_PORT}")
    print(f"  OmniRoute: http://localhost:20128")
    print(f"{'='*50}")
    print(f"\n  Open http://localhost:{PORT} in your browser\n")
    try:
        server.start()
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServer stopped.")
        server.server_close()
