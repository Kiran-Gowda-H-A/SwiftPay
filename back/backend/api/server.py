
from http.server import BaseHTTPRequestHandler, HTTPServer
import json, os, urllib.parse
from ..core.services import Services, ServiceError, make_token, verify_token



DB_PATH = os.environ.get("PAYTM_LITE_DB", ":memory:")
services = Services(DB_PATH)

def json_resp(handler, status, data):
    body = json.dumps(data).encode()
    handler.send_response(status)
    handler.send_header("Content-Type","application/json")
    handler.send_header("Access-Control-Allow-Origin","*")
    handler.send_header("Access-Control-Allow-Headers","*")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)

class App(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin","*")
        self.send_header("Access-Control-Allow-Headers","*")
        self.send_header("Access-Control-Allow-Methods","GET,POST,OPTIONS")
        self.end_headers()

    def do_GET(self):
        route = f"GET {self.path.split('?')[0]}"
        if route == "GET /health":
            return json_resp(self, 200, {"status":"ok"})
        # Auth
        auth = self.headers.get("Authorization","")
        uid = None
        if auth.startswith("Bearer "):
            payload = verify_token(auth.split(" ",1)[1])
            if payload: uid = payload.get("uid")

        if route == "GET /api/me":
            if not uid: return json_resp(self, 401, {"error":"unauthorized"})
            return json_resp(self, 200, services.get_user(uid))

        if route == "GET /api/transactions":
            if not uid: return json_resp(self, 401, {"error":"unauthorized"})
            return json_resp(self, 200, services.transactions(uid))

        if route == "GET /api/admin/users":
            if not uid: return json_resp(self, 401, {"error":"unauthorized"})
            # admin check
            if not services.get_user(uid)["is_admin"]:
                return json_resp(self, 403, {"error":"admin only"})
            return json_resp(self, 200, services.admin_users())

        return json_resp(self, 404, {"error":"not found"})

    def do_POST(self):
        path = self.path.split('?')[0]
        length = int(self.headers.get("Content-Length",0))
        body = json.loads(self.rfile.read(length) or b"{}")
        route = f"POST {path}"

        # Helpers
        auth = self.headers.get("Authorization","")
        uid = None
        if auth.startswith("Bearer "):
            payload = verify_token(auth.split(" ",1)[1])
            if payload: uid = payload.get("uid")

        if route == "POST /api/auth/register":
            try:
                row = services.register(body.get("phone"), body.get("password"), body.get("name"), body.get("is_admin", False))
                token = make_token({"uid": row["id"]})
                return json_resp(self, 200, {"token": token, "user": row})
            except ServiceError as e:
                return json_resp(self, 400, {"error": str(e)})
            except Exception as e:
                return json_resp(self, 400, {"error": "phone may already exist"})

        if route == "POST /api/auth/login":
            try:
                row = services.login(body.get("phone"), body.get("password"))
                token = make_token({"uid": row["id"]})
                return json_resp(self, 200, {"token": token, "is_admin": bool(row["is_admin"])})
            except ServiceError as e:
                return json_resp(self, 401, {"error": str(e)})

        if route == "POST /api/admin/login":
            try:
                row = services.login(body.get("phone"), body.get("password"))
                if not row["is_admin"]:
                    return json_resp(self, 403, {"error":"not an admin"})
                token = make_token({"uid": row["id"]})
                return json_resp(self, 200, {"token": token, "admin": True})
            except ServiceError as e:
                return json_resp(self, 401, {"error": str(e)})

        if not uid: 
            return json_resp(self, 401, {"error":"unauthorized"})

        # Wallet ops
        try:
            if route == "POST /api/wallet/add":
                u = services.add_money(uid, body.get("amount_cents"), body.get("source","card"))
                return json_resp(self, 200, u)

            if route == "POST /api/wallet/transfer":
                u = services.transfer(uid, body.get("to_phone"), body.get("amount_cents"))
                return json_resp(self, 200, u)

            if route == "POST /api/wallet/pay_merchant":
                u = services.pay_merchant(uid, body.get("merchant_code"), body.get("amount_cents"))
                return json_resp(self, 200, u)

            if route == "POST /api/bills/pay":
                u = services.pay_bill(uid, body.get("category"), body.get("ref"), body.get("amount_cents"))
                return json_resp(self, 200, u)

            if route == "POST /api/kyc/submit":
                # demo only
                return json_resp(self, 200, {"ok": True})

            # Admin actions
            if route == "POST /api/admin/kyc/approve":
                if not services.get_user(uid)["is_admin"]: return json_resp(self, 403, {"error":"admin only"})
                services.admin_kyc_approve(body.get("user_id"))
                return json_resp(self, 200, {"ok": True})

            if route == "POST /api/admin/users/block":
                if not services.get_user(uid)["is_admin"]: return json_resp(self, 403, {"error":"admin only"})
                services.admin_block(body.get("user_id"), body.get("block"))
                return json_resp(self, 200, {"ok": True})

        except ServiceError as e:
            return json_resp(self, 400, {"error": str(e)})
        except Exception as e:
            return json_resp(self, 400, {"error": "bad request"})

        return json_resp(self, 404, {"error":"not found"})

def run():
    port = int(os.environ.get("PORT","8088"))
    print(f"Serving at http://127.0.0.1:{port}")
    HTTPServer(("", port), App).serve_forever()

def run():
    port = int(os.environ.get("PORT","8088"))

    # Auto-create default admin if not exists
    try:
        existing_admin = services.login("9999", "admin")
        print("✅ Default admin already exists.")
    except ServiceError:
        print("⚠️ Creating default admin...")
        try:
            services.register("9999", "admin", "Default Admin", True)
            print("✅ Default admin created: phone=9999 password=admin")
        except Exception as e:
            print("❌ Failed to create default admin:", e)

    print(f"Serving at http://127.0.0.1:{port}")
    HTTPServer(("", port), App).serve_forever()


if __name__ == "__main__":
    run()
