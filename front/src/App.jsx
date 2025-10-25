import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Bills from "./pages/Bills";
import KYC from "./pages/Kyc";
import Admin from "./pages/Admin";
import Send from "./pages/Send";
import Merchant from "./pages/Merchant";
import AdminLogin from "./pages/AdminLogin";

function Protected({ children }) {
  const token = useAuthStore((s) => s.token);
  const loc = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}

function Redirector() {
  const token = useAuthStore((s) => s.token);
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Redirect root depending on login */}
      <Route path="/" element={<Redirector />} />

      {/* Protected User Routes */}
      <Route
        path="/dashboard"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />
      <Route
        path="/bills"
        element={
          <Protected>
            <Bills />
          </Protected>
        }
      />
      <Route
        path="/kyc"
        element={
          <Protected>
            <KYC />
          </Protected>
        }
      />
      <Route
        path="/send"
        element={
          <Protected>
            <Send />
          </Protected>
        }
      />
      <Route
        path="/merchant"
        element={
          <Protected>
            <Merchant />
          </Protected>
        }
      />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <Protected>
            <Admin />
          </Protected>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
