
import { useState } from "react";
import Navbar from "../components/ui/Navbar";
import api from "../services/api";
import { Phone, CreditCard, Banknote, IndianRupee } from "lucide-react";

export default function Send() {
  const [mode, setMode] = useState("wallet");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const amt = parseInt(amount, 10);
    if (!amt || amt <= 0 || amt > 50000) {
      return alert("Enter a valid amount between ₹1 and ₹50,000");
    }

    try {
      setLoading(true);
      if (mode === "wallet") {
        if (!to) return alert("Enter recipient phone");
        await api.post("/api/wallet/transfer", {
          to_phone: to,
          amount_cents: amt * 100,
        });
        alert("Money sent via Wallet ✅");
      } else if (mode === "upi") {
        await api.post("/api/wallet/pay_merchant", {
          merchant_code: to || "upi",
          amount_cents: amt * 100,
        });
        alert("UPI payment simulated (5% cashback) 🎉");
      } else {
        await api.post("/api/wallet/pay_merchant", {
          merchant_code: to || "bank",
          amount_cents: amt * 100,
        });
        alert("Bank transfer simulated (5% cashback) 🏦");
      }
      window.location.href = "/";
    } catch (e) {
      alert(e?.response?.data?.error || "Transaction failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Send Money</h2>

          {/* Toggle buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setMode("wallet")}
              className={`flex-1 py-2 rounded-xl font-medium transition ${
                mode === "wallet"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Wallet
            </button>
            <button
              onClick={() => setMode("upi")}
              className={`flex-1 py-2 rounded-xl font-medium transition ${
                mode === "upi"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              UPI
            </button>
            <button
              onClick={() => setMode("bank")}
              className={`flex-1 py-2 rounded-xl font-medium transition ${
                mode === "bank"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Bank
            </button>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <div className="relative">
              {mode === "wallet" && (
                <Phone className="absolute left-3 top-3 text-gray-400" />
              )}
              {mode === "upi" && (
                <CreditCard className="absolute left-3 top-3 text-gray-400" />
              )}
              {mode === "bank" && (
                <Banknote className="absolute left-3 top-3 text-gray-400" />
              )}
              <input
                className="input pl-10"
                placeholder={
                  mode === "wallet"
                    ? "Recipient Phone"
                    : mode === "upi"
                    ? "UPI ID"
                    : "Account / IFSC"
                }
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <div className="relative">
              <IndianRupee className="absolute left-3 top-3 text-gray-400" />
              <input
                type="number"
                className="input pl-10"
                placeholder="Amount (₹)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                max="50000"
              />
            </div>
          </div>

          {/* Proceed button */}
          <button
            onClick={submit}
            disabled={loading}
            className={`w-full mt-6 py-3 rounded-xl font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow hover:from-blue-700 hover:to-blue-600"
            }`}
          >
            {loading ? "Processing..." : "Proceed"}
          </button>

          {/* Info */}
          <p className="text-sm text-gray-500 mt-3 text-center">
            {mode === "wallet"
              ? "Instant wallet-to-wallet transfer 🔄"
              : "Debits your wallet & simulates payment with 5% cashback 💸"}
          </p>
        </div>
      </main>
    </div>
  );
}
