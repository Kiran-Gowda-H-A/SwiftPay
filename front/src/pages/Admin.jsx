
import { useEffect, useState } from "react";
import Navbar from "../components/ui/Navbar";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const nav = useNavigate();

  async function load() {
    const { data } = await api.get("/api/admin/users");
    setUsers(data);
  }

  useEffect(() => {
    (async () => {
      try {
        await load();
      } catch (e) {
        if (e?.response?.status === 403) nav("/admin/login");
      }
    })();
  }, []);

  const approve = async (id) => {
    await api.post("/api/admin/kyc/approve", { user_id: id });
    load();
  };

  const toggleBlock = async (u) => {
    await api.post("/api/admin/users/block", {
      user_id: u.id,
      block: u.kyc_status !== "blocked",
    });
    load();
  };

  const filtered = users.filter((u) =>
    (u.phone + (u.name || "")).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-800">
              👨‍💼 Admin – Users
            </h2>
            <input
              className="w-full sm:w-64 px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="🔍 Search phone or name"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">KYC</th>
                  <th className="py-3 px-4">Balance</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((u, i) => (
                  <tr
                    key={u.id}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="py-3 px-4 font-medium text-gray-700">
                      {u.id}
                    </td>
                    <td className="py-3 px-4">{u.phone}</td>
                    <td className="py-3 px-4">{u.name || "-"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.kyc_status === "approved"
                            ? "bg-green-100 text-green-700"
                            : u.kyc_status === "blocked"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {u.kyc_status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      ₹{(u.balance_cents / 100).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        onClick={() => approve(u.id)}
                        className="px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => toggleBlock(u)}
                        className={`px-3 py-1 rounded-lg text-white transition ${
                          u.kyc_status === "blocked"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {u.kyc_status === "blocked" ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
