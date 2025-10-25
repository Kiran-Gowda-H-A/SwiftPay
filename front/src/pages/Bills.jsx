
import { useState } from "react";
import Navbar from "../components/ui/Navbar";
import api from "../services/api";
import { Zap, Tv, Flame, Droplet, Wifi, Phone, Landmark, GraduationCap, Bus, X } from "lucide-react";

const providers = [
  { code: "electricity", name: "Electricity", icon: <Zap className="w-8 h-8 text-yellow-500" /> },
  { code: "dth", name: "DTH", icon: <Tv className="w-8 h-8 text-blue-500" /> },
  { code: "gas", name: "Gas", icon: <Flame className="w-8 h-8 text-red-500" /> },
  { code: "water", name: "Water", icon: <Droplet className="w-8 h-8 text-cyan-500" /> },
  { code: "broadband", name: "Broadband", icon: <Wifi className="w-8 h-8 text-green-500" /> },
  { code: "mobile", name: "Mobile Recharge", icon: <Phone className="w-8 h-8 text-purple-500" /> },
  { code: "landline", name: "Landline", icon: <Landmark className="w-8 h-8 text-gray-600" /> },
  { code: "education", name: "Education Fees", icon: <GraduationCap className="w-8 h-8 text-indigo-500" /> },
  { code: "metro", name: "Metro Recharge", icon: <Bus className="w-8 h-8 text-orange-500" /> },
];

export default function Bills() {
  const [picked, setPicked] = useState(null);
  const [ref, setRef] = useState("");
  const [amount, setAmount] = useState("");

  const pay = async () => {
    if (!picked || !ref || !amount) return alert("Fill all details");
    await api.post("/api/bills/pay", {
      category: picked.code,
      ref,
      amount_cents: parseInt(amount, 10) * 100,
    });
    alert("Bill paid!");
    setPicked(null); // close modal after payment
    setRef("");
    setAmount("");
  };

  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="card">
          <h2 className="font-semibold mb-4">Pay Bills</h2>

          {/* Grid of categories */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {providers.map((p) => (
              <div
                key={p.code}
                className="flex flex-col items-center justify-center p-6 rounded-2xl shadow-md cursor-pointer transition bg-white hover:shadow-lg"
                onClick={() => setPicked(p)}
              >
                {p.icon}
                <span className="mt-2 text-sm font-medium text-center">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal for form */}
      {picked && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setPicked(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">Pay {picked.name} Bill</h3>
            <div className="grid gap-3">
              <input
                className="input"
                placeholder={`${picked.name} Ref`}
                value={ref}
                onChange={(e) => setRef(e.target.value)}
              />
              <input
                className="input"
                placeholder="Amount (₹)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button onClick={pay} className="btn-primary w-full">
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
