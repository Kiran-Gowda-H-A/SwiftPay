
import { useState } from "react";
import Navbar from "../components/ui/Navbar";
import api from "../services/api";
import { IdCard, Home, FileText } from "lucide-react";

export default function KYC() {
  const [pan, setPan] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [address, setAddress] = useState("");

  const submit = async () => {
    if (!pan || !aadhaar || !address) return alert("Please fill all fields");
    await api.post("/api/kyc/submit", { pan, aadhaar, address });
    alert("✅ KYC submitted successfully!");
    setPan("");
    setAadhaar("");
    setAddress("");
  };

  return (
    <div>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🔐 KYC Verification
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Please enter your details below to verify your identity
          </p>

          {/* Form */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border rounded-xl bg-white px-4 py-3 shadow-sm">
              <FileText className="w-5 h-5 text-blue-600" />
              <input
                className="w-full outline-none text-gray-700"
                placeholder="Enter PAN Number"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 border rounded-xl bg-white px-4 py-3 shadow-sm">
              <IdCard className="w-5 h-5 text-green-600" />
              <input
                className="w-full outline-none text-gray-700"
                placeholder="Enter Aadhaar Number"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 border rounded-xl bg-white px-4 py-3 shadow-sm">
              <Home className="w-5 h-5 text-indigo-600" />
              <input
                className="w-full outline-none text-gray-700"
                placeholder="Enter Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={submit}
            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:opacity-90 transition"
          >
            Submit KYC
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            🔒 Your information is encrypted and kept secure. (Demo only)
          </p>
        </div>
      </main>
    </div>
  );
}
