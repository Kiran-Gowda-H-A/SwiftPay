# 💰 Paytm Clone – Finance Web Application

A full-stack **Paytm Clone** web application built using **React.js (frontend)**, **Flask (backend)**, and **SQLite (database)**.  
This project simulates key wallet-based financial operations — including adding money, sending money, merchant payments, bill payments, and transaction history.

---

## 🚀 Features

### 🏦 Wallet Management
- Display wallet balance
- Add money to wallet (limit ₹50,000)
- Instant wallet updates with transaction logging

### 💸 Money Transfer
- Send money via **Wallet**, **UPI**, or **Bank**
- Recipient validation and amount input fields
- Instant transfer simulation

### 🧾 Merchant Payments
- Pay merchants using **Merchant Code / UPI / QR Ref**
- Automatic cashback (5%) applied to each merchant payment
- Real-time transaction update on dashboard

### 📑 Bill Payments
- Pay bills for:
  - Electricity
  - DTH
  - Gas
  - Water
  - Broadband
  - Mobile Recharge
  - Landline
  - Education Fees
  - Metro Recharge

### 🪙 Offers & Deals
- Attractive banners showcasing live offers:
  - Movie tickets
  - Shopping discounts
  - Food orders
  - Travel and cashback deals

### 📋 Recent Transactions
- Displays transaction history with status:
  - **Credited (Green)**
  - **Debited (Red)**
- Shows transaction details (amount, type, timestamp)

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js (Vite), HTML, CSS, JavaScript |
| **Backend** | Flask (Python) |
| **Database** | SQLite |
| **Styling** | Tailwind CSS / Bootstrap |
| **APIs** | RESTful API endpoints with JSON |
| **State Management** | React Hooks / Context API |

---

## 🧩 Project Structure

```
📁 paytm-clone/
│
├── 📂 frontend/               # React.js client
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── 📂 backend/                # Flask server
│   ├── app.py
│   ├── models.py
│   ├── database.db
│   ├── requirements.txt
│   └── routes/
│       ├── wallet.py
│       ├── merchant.py
│       ├── bills.py
│       └── user.py
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 🧭 Prerequisites
Make sure you have installed:
- Node.js ≥ 16.x
- Python ≥ 3.8
- pip
- Virtual environment (optional)

---

### 🖥️ Backend Setup (Flask)

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # (on Windows)
source venv/bin/activate   # (on Mac/Linux)

pip install -r requirements.txt
python app.py
```

> Flask server will start on `http://127.0.0.1:5000`

---

### 💻 Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

> React app will start on `http://localhost:5173`

---

## 🔗 API Endpoints (Sample)

| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/add-money` | POST | Add funds to wallet |
| `/api/send-money` | POST | Transfer money to another user |
| `/api/pay-merchant` | POST | Pay a merchant |
| `/api/get-transactions` | GET | Retrieve transaction history |
| `/api/get-balance` | GET | Fetch wallet balance |

---

## 🧾 Screenshots

### Dashboard
![Dashboard](./assets/screenshots/dashboard.png)

### Add Money
![Add Money](./assets/screenshots/add-money.png)

### Send Money
![Send Money](./assets/screenshots/send-money.png)

### Pay Merchant
![Merchant](./assets/screenshots/merchant.png)

### Bill Payments
![Bills](./assets/screenshots/bills.png)

### Transactions
![Transactions](./assets/screenshots/transactions.png)

---

## 🧑‍💻 Author

**Kiran Gowda H A**  
💼 Full Stack Developer  
📧 [hakirangowda@gmail.com]  
🌐 [LinkedIn Profile](https://www.linkedin.com/in/kiran-gowda-h-a--/)

---

## 🏁 Future Enhancements
- ✅ User authentication & OTP verification  
- ✅ Transaction receipts (PDF export)  
- ✅ Payment gateway integration (Razorpay / Stripe)  
- ✅ Mobile-friendly PWA support  
- ✅ Push notifications for transaction alerts  

---

## 📜 License
This project is open-source and available to upgrade the project according to the road map.

---

⭐ **If you like this project, don’t forget to star the repo!**
