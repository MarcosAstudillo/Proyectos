"""
=============================================================================
KMKCStats - Servidor Proxy Local para Supercell Clash Royale API
=============================================================================
Propósito:
  1. Soluciona el problema de CORS en el navegador al añadir cabeceras Access-Control-Allow-Origin.
  2. Las peticiones salen desde tu propia máquina, cumpliendo con la IP autorizada en tu token (83.56.26.27).

Uso:
  python proxy.py
  
Luego abre tu navegador en index.html y la web consultará la API oficial de Supercell en vivo.
"""

import http.server
import socketserver
import urllib.request
import urllib.error
import json
import sys

PORT = 8080
TARGET_BASE = "https://api.clashroyale.com"
DEFAULT_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjljZTMxYjcwLWJmY2UtNDBlNS04MDE2LWQ2OTFlNzM4M2M5ZSIsImlhdCI6MTc5MDE3OTUwOSwic3ViIjoiZGV2ZWxvcGVyL2M4MmRjZWIzLTQyZDAtNDNkNy1iYTE4LTY2MTk0ZWZkNDMxOCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI4My41Ni4yNi4yNyJdLCJ0eXBlIjoiY2xpZW50In1dfQ.ANN_dt_QvJLYicqBsCjDXdZ7xVVIaTRLgMlkYiXb_s6ih4o8hLtvHf6r3NvrTQkVg8Ho4eX9qax9YQuZFyK7CA"

class SupercellProxyHandler(http.server.BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, Origin, X-Requested-With")
        self.send_header("Access-Control-Max-Age", "86400")

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        # Asegurar ruta hacia /v1 si viene sin prefijo o con prefijo
        path = self.path
        target_url = TARGET_BASE + path

        headers = {
            "Accept": "application/json",
            "User-Agent": "KMKCStats-Proxy/1.0"
        }

        # Reenviar el token de autorización si viene en la petición, o usar el por defecto
        auth = self.headers.get("Authorization")
        if auth:
            headers["Authorization"] = auth
        elif DEFAULT_TOKEN:
            headers["Authorization"] = f"Bearer {DEFAULT_TOKEN}"

        try:
            req = urllib.request.Request(target_url, headers=headers)
            with urllib.request.urlopen(req) as response:
                content = response.read()
                self.send_response(response.status)
                self._send_cors_headers()
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(content)
                print(f"[OK 200] GET {path}")
        except urllib.error.HTTPError as e:
            err_body = e.read()
            self.send_response(e.code)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(err_body)
            print(f"[HTTP {e.code}] GET {path}")
        except Exception as e:
            self.send_response(500)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            print(f"[ERROR 500] {e}")

    def log_message(self, format, *args):
        # Desactivar logs por defecto ruidosos de BaseHTTPRequestHandler
        pass

if __name__ == "__main__":
    # Asegurar compatibilidad de consola en Windows
    if sys.platform == "win32":
        try:
            sys.stdout.reconfigure(encoding='utf-8')
            sys.stderr.reconfigure(encoding='utf-8')
        except Exception:
            pass

    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", PORT), SupercellProxyHandler) as httpd:
            print("=" * 65)
            print(f"  [+] KMKCStats - Proxy Supercell Clash Royale API Activo")
            print(f"  [*] URL del Proxy: http://localhost:{PORT}/v1")
            print(f"  [*] Destino:       {TARGET_BASE}/v1")
            print(f"  [*] IP Autorizada: 83.56.26.27 (Tu IP)")
            print(f"  [*] Bypass CORS:   Habilitado (*)")
            print("=" * 65)
            print("Esperando peticiones de la web... (Pulsa Ctrl+C para salir)\n")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[!] Proxy detenido.")
        sys.exit(0)
