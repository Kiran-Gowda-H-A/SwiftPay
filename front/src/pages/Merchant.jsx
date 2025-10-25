
import { useState } from "react";
import Navbar from "../components/ui/Navbar";
import api from "../services/api";
import { Store, IndianRupee } from "lucide-react";

export default function Merchant() {
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const amt = parseInt(amount, 10);
    if (!code) return alert("Enter merchant code / UPI / QR reference");
    if (!amt || amt <= 0 || amt > 50000)
      return alert("Enter a valid amount between ₹1 and ₹50,000");

    try {
      setLoading(true);
      await api.post("/api/wallet/pay_merchant", {
        merchant_code: code,
        amount_cents: amt * 100,
      });
      alert("✅ Merchant paid! 5% cashback credited 🎉");
      window.location.href = "/";
    } catch (e) {
      alert(e?.response?.data?.error || "Payment failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Pay a Merchant</h2>

          {/* Input Fields */}
          <div className="space-y-4">
            <div className="relative">
              <Store className="absolute left-3 top-3 text-gray-400" />
              <input
                className="input pl-10"
                placeholder="Merchant Code / UPI ID / QR Ref"
                value={code}
                onChange={(e) => setCode(e.target.value)}
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

          {/* Pay Button */}
          <button
            onClick={submit}
            disabled={loading}
            className={`w-full mt-6 py-3 rounded-xl font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-green-500 text-white shadow hover:from-green-700 hover:to-green-600"
            }`}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>

          {/* Cashback Info */}
          <p className="text-sm text-gray-500 mt-3 text-center">
            💡 Every merchant payment gives you an instant <b>5% cashback</b>.
          </p>
        </div>
      </main>
    </div>
  );
}
