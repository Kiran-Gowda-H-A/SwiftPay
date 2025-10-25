
import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { Phone, Lock } from "lucide-react";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "login") await login(phone, password);
      else await register(phone, password);
      window.location.href = "/";
    } catch (e) {
      alert(e?.response?.data?.error || "Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white grid place-content-center text-2xl font-bold shadow-lg">
              ₹
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-800">Finance</h1>
            <p className="text-gray-500 text-sm">
              Fast • Simple • Secure
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" />
              <input
                className="input pl-10"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                className="input pl-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg hover:from-blue-700 hover:to-blue-600 transition"
            >
              {mode === "login" ? "Login" : "Create Account"}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="text-center text-sm text-gray-600 mt-6">
            {mode === "login" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
