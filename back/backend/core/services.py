import sqlite3, time, json, hmac, hashlib, os
from .sms_utils import send_sms  # ✅ SMS utility

class ServiceError(Exception): 
    pass

SCHEMA = '''
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE,
    password_hash TEXT,
    name TEXT,
    is_admin INTEGER DEFAULT 0,
    kyc_status TEXT DEFAULT 'pending'
);
CREATE TABLE IF NOT EXISTS wallets(
    user_id INTEGER PRIMARY KEY,
    balance_cents INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS transactions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    ttype TEXT,
    amount_cents INTEGER,
    status TEXT,
    counterparty TEXT,
    metadata TEXT,
    created_at INTEGER
);
'''

def hash_pw(p): 
    return hashlib.sha256(p.encode()).hexdigest()

class Services:
    def __init__(self, db_path=':memory:'):
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self.conn.executescript(SCHEMA)
        self.conn.commit()

    def register(self, phone, password, name=None, is_admin=False):
        cur = self.conn.cursor()
        cur.execute("INSERT INTO users(phone,password_hash,name,is_admin) VALUES(?,?,?,?)",
                    (phone, hash_pw(password), name, 1 if is_admin else 0))
        uid = cur.lastrowid
        cur.execute("INSERT INTO wallets(user_id,balance_cents) VALUES(?,0)", (uid,))
        self.conn.commit()
        return self.get_user(uid)

    def login(self, phone, password):
        row = self.conn.execute("SELECT * FROM users WHERE phone=?", (phone,)).fetchone()
        if not row or row["password_hash"] != hash_pw(password): 
            raise ServiceError("invalid credentials")
        return row

    def get_user(self, uid):
        u = self.conn.execute("SELECT * FROM users WHERE id=?", (uid,)).fetchone()
        w = self.conn.execute("SELECT balance_cents FROM wallets WHERE user_id=?", (uid,)).fetchone()
        return {"id": u["id"], "phone": u["phone"], "name": u["name"], "is_admin": bool(u["is_admin"]), 
                "kyc_status": u["kyc_status"], "balance_cents": w["balance_cents"]}

    def add_money(self, uid, amount_cents, source="card"):
        if amount_cents <= 0: 
            raise ServiceError("amount must be positive")
        now = int(time.time())
        self.conn.execute("UPDATE wallets SET balance_cents=balance_cents+? WHERE user_id=?", (amount_cents, uid))
        self.conn.execute("INSERT INTO transactions(user_id,ttype,amount_cents,status,counterparty,metadata,created_at) VALUES (?,?,?,?,?,?,?)",
                          (uid, "add_money_credit", amount_cents, "success", source, "{}", now))
        self.conn.commit()

        # ✅ SMS for credit
        user = self.get_user(uid)
        phone = "+91" + str(user["phone"])
        send_sms(phone, f"₹{amount_cents/100:.2f} credited to your wallet. New balance: ₹{user['balance_cents']/100:.2f}")

        return user

    def _ensure_balance(self, uid, amount_cents):
        bal = self.conn.execute("SELECT balance_cents FROM wallets WHERE user_id=?", (uid,)).fetchone()["balance_cents"]
        if bal < amount_cents: 
            raise ServiceError("insufficient balance")

    def transfer(self, from_uid, to_phone, amount_cents):
        if amount_cents <= 0: 
            raise ServiceError("amount must be positive")
        to = self.conn.execute("SELECT id,phone FROM users WHERE phone=?", (to_phone,)).fetchone()
        if not to: 
            raise ServiceError("recipient not found")
        to_uid = to["id"]
        self._ensure_balance(from_uid, amount_cents)
        now = int(time.time())
        cur = self.conn.cursor()
        cur.execute("UPDATE wallets SET balance_cents=balance_cents-? WHERE user_id=?", (amount_cents, from_uid))
        cur.execute("UPDATE wallets SET balance_cents=balance_cents+? WHERE user_id=?", (amount_cents, to_uid))
        cur.execute("INSERT INTO transactions(user_id,ttype,amount_cents,status,counterparty,metadata,created_at) VALUES (?,?,?,?,?,?,?)",
                    (from_uid, "wallet_transfer_debit", amount_cents, "success", str(to_phone), "{}", now))
        cur.execute("INSERT INTO transactions(user_id,ttype,amount_cents,status,counterparty,metadata,created_at) VALUES (?,?,?,?,?,?,?)",
                    (to_uid, "wallet_transfer_credit", amount_cents, "success", "", "{}", now))
        self.conn.commit()

        # ✅ SMS for sender
        sender = self.get_user(from_uid)
        send_sms("+91" + str(sender["phone"]), f"₹{amount_cents/100:.2f} debited for transfer to {to_phone}. Balance: ₹{sender['balance_cents']/100:.2f}")

        # ✅ SMS for receiver
        receiver = self.get_user(to_uid)
        send_sms("+91" + str(receiver["phone"]), f"₹{amount_cents/100:.2f} credited from {sender['phone']}. Balance: ₹{receiver['balance_cents']/100:.2f}")

        return sender

    def pay_merchant(self, uid, merchant_code, amount_cents, cashback_percent=5):
        if amount_cents <= 0: 
            raise ServiceError("amount must be positive")
        self._ensure_balance(uid, amount_cents)
        now = int(time.time())
        cur = self.conn.cursor()
        cur.execute("UPDATE wallets SET balance_cents=balance_cents-? WHERE user_id=?", (amount_cents, uid))
        cur.execute("INSERT INTO transactions(user_id,ttype,amount_cents,status,counterparty,metadata,created_at) VALUES (?,?,?,?,?,?,?)",
                    (uid, "merchant_payment", amount_cents, "success", merchant_code, "{}", now))

        # ✅ SMS debit
        user = self.get_user(uid)
        send_sms("+91" + str(user["phone"]), f"₹{amount_cents/100:.2f} debited at merchant {merchant_code}. Balance: ₹{user['balance_cents']/100:.2f}")

        if cashback_percent and cashback_percent > 0:
            cb = int(amount_cents * cashback_percent / 100)
            if cb > 0:
                cur.execute("UPDATE wallets SET balance_cents=balance_cents+? WHERE user_id=?", (cb, uid))
                meta = json.dumps({"cashback_percent": cashback_percent})
                cur.execute("INSERT INTO transactions(user_id,ttype,amount_cents,status,counterparty,metadata,created_at) VALUES (?,?,?,?,?,?,?)",
                            (uid, "cashback_credit", cb, "success", merchant_code, meta, now))
                self.conn.commit()

                # ✅ SMS cashback
                user = self.get_user(uid)
                send_sms("+91" + str(user["phone"]), f"₹{cb/100:.2f} cashback credited from merchant {merchant_code}. Balance: ₹{user['balance_cents']/100:.2f}")
        else:
            self.conn.commit()

        return self.get_user(uid)

    def pay_bill(self, uid, category, ref, amount_cents):
        if amount_cents <= 0: 
            raise ServiceError("amount must be positive")
        self._ensure_balance(uid, amount_cents)
        now = int(time.time())
        cur = self.conn.cursor()
        cur.execute("UPDATE wallets SET balance_cents=balance_cents-? WHERE user_id=?", (amount_cents, uid))
        meta = json.dumps({"category": category, "ref": ref})
        cur.execute("INSERT INTO transactions(user_id,ttype,amount_cents,status,counterparty,metadata,created_at) VALUES (?,?,?,?,?,?,?)",
                    (uid, "bill_payment", amount_cents, "success", ref, meta, now))
        self.conn.commit()

        # ✅ SMS debit
        user = self.get_user(uid)
        send_sms("+91" + str(user["phone"]), f"₹{amount_cents/100:.2f} debited for {category} bill (Ref: {ref}). Balance: ₹{user['balance_cents']/100:.2f}")

        return user

    def transactions(self, uid):
        cur = self.conn.cursor()
        rows = cur.execute("SELECT * FROM transactions WHERE user_id=? ORDER BY id DESC", (uid,)).fetchall()
        return [dict(x) for x in rows]

    # Admin
    def admin_users(self):
        rows = self.conn.execute("SELECT id,phone,name,is_admin,kyc_status,(SELECT balance_cents FROM wallets w WHERE w.user_id=users.id) as balance_cents FROM users").fetchall()
        return [dict(r) for r in rows]

    def admin_kyc_approve(self, user_id):
        self.conn.execute("UPDATE users SET kyc_status='approved' WHERE id=?", (user_id,))
        self.conn.commit()

    def admin_block(self, user_id, block: bool):
        self.conn.execute("UPDATE users SET kyc_status=? WHERE id=?", ('blocked' if block else 'approved', user_id))
        self.conn.commit()


SECRET = os.environ.get("PAYTM_LITE_SECRET","devsecret")

def make_token(payload: dict):
    b = json.dumps(payload).encode()
    sig = hmac.new(SECRET.encode(), b, hashlib.sha256).hexdigest()
    return b.hex()+'.'+sig

def verify_token(token: str):
    try:
        bhex, sig = token.split('.',1)
        b = bytes.fromhex(bhex)
        if hmac.new(SECRET.encode(), b, hashlib.sha256).hexdigest() != sig: 
            return None
        return json.loads(b.decode())
    except Exception:
        return None
