import { Link, useLocation } from "react-router-dom";
import {
  Wallet,
  Receipt,
  ShieldCheck,
  UserCog,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../../store/auth";

export default function Navbar() {
  const { me, logout } = useAuthStore();
  const loc = useLocation();

  const active = (p) =>
    loc.pathname === p
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-500 transition-colors";

  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur border-b shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white grid place-content-center font-bold shadow-md">
            ₹
          </div>
          <span className="font-semibold text-lg tracking-tight">
            Finance
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={`flex items-center gap-2 ${active("/")}`}>
            <Wallet size={18} /> Wallet
          </Link>
          <Link to="/bills" className={`flex items-center gap-2 ${active("/bills")}`}>
            <Receipt size={18} /> Bills
          </Link>
          <Link to="/kyc" className={`flex items-center gap-2 ${active("/kyc")}`}>
            <ShieldCheck size={18} /> KYC
          </Link>
          <Link to="/admin" className={`flex items-center gap-2 ${active("/admin")}`}>
            <UserCog size={18} /> Admin
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-sm text-gray-500">
            +{me?.phone}
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}
