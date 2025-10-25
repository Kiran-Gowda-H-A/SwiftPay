

import { useState } from "react";
import { useAuthStore } from "../store/auth";
import api from "../services/api";
import { Shield, Phone, Lock } from "lucide-react";

export default function AdminLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/login", { phone, password });
      await login(phone, password);
      window.location.href = "/admin";
    } catch (e) {
      alert(e?.response?.data?.error || "Unauthorized");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white grid place-content-center shadow-lg">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-gray-400 text-sm">Restricted Access Only</p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" />
              <input
                className="input pl-10 bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                placeholder="Admin Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                className="input pl-10 bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg transition"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-500">
            Unauthorized access is strictly prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
