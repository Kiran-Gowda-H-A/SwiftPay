import { useEffect, useState } from "react";
import Navbar from "../components/ui/Navbar";
import BalanceCard from "../components/dashboard/BalanceCard";
import QuickActions from "../components/dashboard/QuickActions";
import Transactions from "../components/dashboard/Transactions";
import api from "../services/api";
import { useAuthStore } from "../store/auth";
import { motion } from "framer-motion";
import Toast from "../components/ui/toast";

export default function Dashboard() {
  const { me, loadMe } = useAuthStore();
  const [tx, setTx] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState("");

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  async function refresh() {
    await loadMe();
    const { data } = await api.get("/api/transactions");
    setTx(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  const handleAddMoney = async () => {
    if (!amount || parseInt(amount) <= 0 || parseInt(amount) > 50000) {
      setToast({
        show: true,
        message: "Enter a valid amount (₹1 - ₹50,000)",
        type: "error",
      });
      setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return;
    }

    await api.post("/api/wallet/add", {
      amount_cents: parseInt(amount, 10) * 100,
      source: "card",
    });

    setShowAddMoney(false);
    setAmount("");
    refresh();

    setToast({
      show: true,
      message: `₹${amount} added successfully!`,
      type: "success",
    });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  // Example offers
  const offers = [
    {
      id: 1,
      title: "💸 5% Cashback",
      desc: "Get 5% cashback on electricity bill payments!",
      details: "Valid once per user. Cashback credited within 24 hours.",
      color: "from-green-400 to-emerald-500",
    },
    {
      id: 2,
      title: "🎬 Movie Offer",
      desc: "Flat ₹100 off on BookMyShow tickets via Paytm.",
      details: "Applicable on min. booking of 2 tickets. Valid till month-end.",
      color: "from-purple-400 to-pink-500",
    },
    {
      id: 3,
      title: "🛒 Shopping Deal",
      desc: "10% off on Myntra & Flipkart orders above ₹999.",
      details: "Offer valid on prepaid transactions only.",
      color: "from-orange-400 to-red-500",
    },
    {
      id: 4,
      title: "🍔 Foodie Treat",
      desc: "Get ₹75 off on Swiggy/Zomato orders above ₹249.",
      details: "Valid twice a month per user. Auto-applied at checkout.",
      color: "from-pink-400 to-rose-500",
    },
    {
      id: 5,
      title: "✈️ Travel Discount",
      desc: "Up to ₹500 off on flight bookings via Paytm Travel.",
      details: "Minimum booking value ₹3000. Limited time offer.",
      color: "from-blue-400 to-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-10">
        {/* Balance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BalanceCard amount={me?.balance_cents || 0} />
        </motion.div>

        {/* Offers Carousel */}
        <div className="overflow-hidden relative w-full">
          <motion.div
            className="flex gap-6"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            }}
          >
            {[...offers, ...offers, ...offers].map((offer, i) => (
              <div
                key={i}
                onClick={() => setSelectedOffer(offer)}
                className={`min-w-[280px] p-5 rounded-2xl shadow-xl text-white bg-gradient-to-r ${offer.color} transform hover:scale-105 transition duration-300 cursor-pointer`}
              >
                <h3 className="text-lg font-bold">{offer.title}</h3>
                <p className="text-sm mt-1 opacity-90">{offer.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <QuickActions onAddMoney={() => setShowAddMoney(true)} />

        {/* Transactions */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Recent Transactions
          </h2>
          <Transactions list={tx} />
        </section>
      </main>

      {/* Offer Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedOffer(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-2">{selectedOffer.title}</h2>
            <p className="text-gray-600 mb-4">{selectedOffer.desc}</p>
            <p className="text-sm text-gray-500 mb-6">
              {selectedOffer.details}
            </p>
            <button
              onClick={() => {
                setToast({
                  show: true,
                  message: `Offer activated: ${selectedOffer.title}`,
                  type: "success",
                });
                setTimeout(() => setToast({ ...toast, show: false }), 3000);
                setSelectedOffer(null);
              }}
              className="btn-primary w-full"
            >
              Activate Offer
            </button>
          </div>
        </div>
      )}

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative"
          >
            <button
              onClick={() => setShowAddMoney(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>

            <h2 className="text-lg font-bold mb-4">Add Money</h2>

            <input
              type="number"
              placeholder="Enter amount in ₹"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input w-full mb-2 border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              min="1"
              max="50000"
            />

            {amount &&
              (parseInt(amount, 10) <= 0 || parseInt(amount, 10) > 50000) && (
                <p className="text-red-500 text-sm mb-2">
                  Amount must be between ₹1 and ₹50,000
                </p>
              )}

            <button
              onClick={handleAddMoney}
              disabled={
                !amount ||
                parseInt(amount, 10) <= 0 ||
                parseInt(amount, 10) > 50000
              }
              className={`w-full btn-primary ${
                !amount ||
                parseInt(amount, 10) <= 0 ||
                parseInt(amount, 10) > 50000
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Add Now
            </button>

            <p className="text-xs text-gray-500 mt-3">
              Maximum wallet top-up limit: ₹50,000
            </p>
          </motion.div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}

// import { useEffect, useState } from "react";
// import Navbar from "../components/ui/Navbar";
// import api from "../services/api";
// import { useAuthStore } from "../store/auth";
// import { motion } from "framer-motion";
// import Toast from "../components/ui/toast";
// import { Wallet, Send, PlusCircle, Receipt } from "lucide-react";
// import Transactions from "../components/dashboard/Transactions";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const { me, loadMe } = useAuthStore();
//   const [tx, setTx] = useState([]);
//   const [showAddMoney, setShowAddMoney] = useState(false);
//   const [amount, setAmount] = useState("");
//   const [toast, setToast] = useState({ show: false, message: "", type: "success" });
//   const navigate = useNavigate();

//   async function refresh() {
//     await loadMe();
//     const { data } = await api.get("/api/transactions");
//     setTx(data);
//   }

//   useEffect(() => {
//     refresh();
//   }, []);

//   const handleAddMoney = async () => {
//     const amt = parseInt(amount, 10);
//     if (!amt || amt <= 0 || amt > 50000) {
//       setToast({ show: true, message: "Enter valid amount (₹1 - ₹50,000)", type: "error" });
//       return;
//     }
//     await api.post("/api/wallet/add", { amount_cents: amt * 100, source: "card" });
//     setShowAddMoney(false);
//     setAmount("");
//     refresh();
//     setToast({ show: true, message: `₹${amt} added successfully 🎉`, type: "success" });
//   };

//   const offers = [
//     { id: 1, title: "⚡ Electricity Cashback", desc: "5% cashback upto ₹100", color: "from-green-400 to-emerald-600" },
//     { id: 2, title: "🎬 Movie Nights", desc: "Flat ₹100 off on BookMyShow", color: "from-purple-400 to-pink-600" },
//     { id: 3, title: "🛒 Shopping Spree", desc: "10% off Flipkart & Myntra", color: "from-orange-400 to-red-500" },
//     { id: 4, title: "🍔 Food Lovers", desc: "₹75 off Zomato & Swiggy", color: "from-pink-400 to-rose-500" },
//     { id: 5, title: "✈ Travel Deals", desc: "Upto ₹500 off flights", color: "from-blue-400 to-indigo-600" },
//   ];

//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       {/* Decorative Background */}
//       <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl"></div>
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>

//       <Navbar />

//       {/* Wallet Hero Card */}
//       <section className="max-w-6xl mx-auto px-4 mt-8">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-8 shadow-xl"
//         >
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="opacity-80 text-sm">Available Balance</p>
//               <h1 className="text-4xl font-bold mt-2">₹{(me?.balance_cents || 0) / 100}</h1>
//               <p className="opacity-70 text-sm mt-1">Hi, {me?.name || "User"} 👋</p>
//             </div>
//             <Wallet className="w-14 h-14 opacity-90" />
//           </div>
//         </motion.div>
//       </section>

//       {/* Offers Carousel - Endless Animation */}
//       <section className="max-w-6xl mx-auto px-4 mt-12 overflow-hidden">
//         <h2 className="text-lg font-semibold mb-4">🔥 Special Offers</h2>
//         <motion.div
//           className="flex gap-6"
//           animate={{ x: ["0%", "-100%"] }}
//           transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
//         >
//           {[...offers, ...offers].map((offer, i) => (
//             <motion.div
//               key={i}
//               whileHover={{ scale: 1.05 }}
//               className={`min-w-[260px] p-6 rounded-2xl shadow-lg text-white bg-gradient-to-r ${offer.color}`}
//             >
//               <h3 className="text-xl font-bold">{offer.title}</h3>
//               <p className="text-sm opacity-90 mt-2">{offer.desc}</p>
//             </motion.div>
//           ))}
//         </motion.div>
//       </section>

//       {/* Quick Actions */}
//       <section className="max-w-6xl mx-auto px-4 mt-10">
//         <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
//           <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAddMoney(true)}
//             className="flex flex-col items-center p-5 rounded-2xl bg-white shadow-md hover:shadow-xl transition">
//             <PlusCircle className="w-9 h-9 text-blue-600" />
//             <span className="mt-2 text-sm font-medium">Add Money</span>
//           </motion.button>
//           <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/send")}
//             className="flex flex-col items-center p-5 rounded-2xl bg-white shadow-md hover:shadow-xl transition">
//             <Send className="w-9 h-9 text-green-600" />
//             <span className="mt-2 text-sm font-medium">Send Money</span>
//           </motion.button>
//           <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/bills")}
//             className="flex flex-col items-center p-5 rounded-2xl bg-white shadow-md hover:shadow-xl transition">
//             <Receipt className="w-9 h-9 text-orange-600" />
//             <span className="mt-2 text-sm font-medium">Pay Bills</span>
//           </motion.button>
//           <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/merchant")}
//             className="flex flex-col items-center p-5 rounded-2xl bg-white shadow-md hover:shadow-xl transition">
//             <Wallet className="w-9 h-9 text-purple-600" />
//             <span className="mt-2 text-sm font-medium">Merchant</span>
//           </motion.button>
//         </div>
//       </section>

//       {/* Transactions */}
//       <section className="max-w-6xl mx-auto px-4 mt-12 pb-20">
//         <h2 className="text-lg font-semibold mb-4">📑 Recent Transactions</h2>
//         <Transactions list={tx} />
//       </section>

//       {/* Add Money Modal */}
//       {showAddMoney && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//           <motion.div
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative"
//           >
//             <button
//               onClick={() => setShowAddMoney(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
//             >
//               ✖
//             </button>

//             <h2 className="text-2xl font-bold mb-6 text-center">💳 Add Money</h2>

//             <input
//               type="number"
//               placeholder="Enter amount in ₹"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))} // only digits
//               className="input w-full mb-2 border p-3 rounded-xl"
//               min="1"
//               max="50000"
//             />

//             {/* Validation Message */}
//             {amount && (parseInt(amount, 10) <= 0 || parseInt(amount, 10) > 50000) && (
//               <p className="text-red-500 text-sm mb-3">
//                 Amount must be between ₹1 and ₹50,000
//               </p>
//             )}

//             <button
//               onClick={handleAddMoney}
//               disabled={
//                 !amount ||
//                 parseInt(amount, 10) <= 0 ||
//                 parseInt(amount, 10) > 50000
//               }
//               className={`w-full py-3 rounded-xl text-lg shadow-md transition ${
//                 !amount ||
//                 parseInt(amount, 10) <= 0 ||
//                 parseInt(amount, 10) > 50000
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700 text-white"
//               }`}
//             >
//               Add Now
//             </button>

//             <p className="text-xs text-gray-500 mt-3 text-center">
//               Maximum wallet top-up limit: ₹50,000
//             </p>
//           </motion.div>
//         </div>
//       )}


//       {/* Toast */}
//       <Toast message={toast.message} type={toast.type} show={toast.show} onClose={() => setToast({ ...toast, show: false })} />
//     </div>
//   );
// }



// import { useEffect, useState } from "react";
// import Navbar from "../components/ui/Navbar";
// import api from "../services/api";
// import { useAuthStore } from "../store/auth";
// import { motion } from "framer-motion";
// import Toast from "../components/ui/toast";
// import { Wallet, Send, PlusCircle, Receipt } from "lucide-react";
// import Transactions from "../components/dashboard/Transactions";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const { me, loadMe } = useAuthStore();
//   const [tx, setTx] = useState([]);
//   const [showAddMoney, setShowAddMoney] = useState(false);
//   const [amount, setAmount] = useState("");
//   const [toast, setToast] = useState({ show: false, message: "", type: "success" });
//   const navigate = useNavigate();

//   async function refresh() {
//     await loadMe();
//     const { data } = await api.get("/api/transactions");
//     setTx(data);
//   }

//   useEffect(() => {
//     refresh();
//   }, []);

//   const handleAddMoney = async () => {
//     const amt = parseInt(amount, 10);
//     if (!amt || amt <= 0 || amt > 50000) {
//       setToast({ show: true, message: "Enter valid amount (₹1 - ₹50,000)", type: "error" });
//       return;
//     }
//     await api.post("/api/wallet/add", { amount_cents: amt * 100, source: "card" });
//     setShowAddMoney(false);
//     setAmount("");
//     refresh();
//     setToast({ show: true, message: `₹${amt} added successfully 🎉`, type: "success" });
//   };

//   const offers = [
//     { id: 1, title: "⚡ Electricity Cashback", desc: "5% cashback upto ₹100", color: "from-green-400 to-emerald-600" },
//     { id: 2, title: "🎬 Movie Nights", desc: "Flat ₹100 off on BookMyShow", color: "from-purple-400 to-pink-600" },
//     { id: 3, title: "🛒 Shopping Spree", desc: "10% off Flipkart & Myntra", color: "from-orange-400 to-red-500" },
//     { id: 4, title: "🍔 Food Lovers", desc: "₹75 off Zomato & Swiggy", color: "from-pink-400 to-rose-500" },
//     { id: 5, title: "✈ Travel Deals", desc: "Upto ₹500 off flights", color: "from-blue-400 to-indigo-600" },
//   ];

//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       {/* Decorative Background */}
//       <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl"></div>
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>

//       <Navbar />

//       {/* Wallet Hero Card */}
//       <section className="max-w-6xl mx-auto px-4 mt-8">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-8 shadow-xl"
//         >
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="opacity-80 text-sm">Available Balance</p>
//               <h1 className="text-4xl font-bold mt-2">₹{(me?.balance_cents || 0) / 100}</h1>
//               <p className="opacity-70 text-sm mt-1">Hi, {me?.name || "User"} 👋</p>
//             </div>
//             <Wallet className="w-14 h-14 opacity-90" />
//           </div>
//         </motion.div>
//       </section>

//       {/* Offers Carousel */}
//       <section className="max-w-6xl mx-auto px-4 mt-12 overflow-hidden">
//         <h2 className="text-lg font-semibold mb-4">🔥 Special Offers</h2>
//         <motion.div
//           className="flex gap-6"
//           animate={{ x: ["0%", "-100%"] }}
//           transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
//         >
//           {[...offers, ...offers].map((offer, i) => (
//             <motion.div
//               key={i}
//               whileHover={{ scale: 1.05 }}
//               className={`min-w-[260px] p-6 rounded-2xl shadow-lg text-white bg-gradient-to-r ${offer.color}`}
//             >
//               <h3 className="text-xl font-bold">{offer.title}</h3>
//               <p className="text-sm opacity-90 mt-2">{offer.desc}</p>
//             </motion.div>
//           ))}
//         </motion.div>
//       </section>

//       {/* Quick Actions */}
//       <section className="max-w-6xl mx-auto px-4 mt-10">
//         <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
//           <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAddMoney(true)}
//             className="flex flex-col items-center p-5 rounded-2xl bg-white shadow-md hover:shadow-xl transition">
//             <PlusCircle className="w-9 h-9 text-blue-600" />
//             <span className="mt-2 text-sm font-medium">Add Money</span>
//           </motion.button>
//           <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/send")}
//             className="flex flex-col items-center p-5 rounded-2xl bg-white shadow-md hover:shadow-xl transition">
//             <Send className="w-9 h-9 text-green-600" />
//             <span className="mt-2 text-sm font-medium">Send Money</span>
//           </motion.button>
//           <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/bills")}
//             className="flex flex-col items-center p-5 rounded-2xl bg-white shadow-md hover:shadow-xl transition">
//             <Receipt className="w-9 h-9 text-orange-600" />
//             <span className="mt-2 text-sm font-medium">Pay Bills</span>
//           </motion.button>
//           <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/merchant")}
//             className="flex flex-col items-center p-5 rounded-2xl bg-white shadow-md hover:shadow-xl transition">
//             <Wallet className="w-9 h-9 text-purple-600" />
//             <span className="mt-2 text-sm font-medium">Merchant</span>
//           </motion.button>
//         </div>
//       </section>

//       {/* Transactions */}
//       <section className="max-w-6xl mx-auto px-4 mt-12 pb-20">
//         <h2 className="text-lg font-semibold mb-4">📑 Recent Transactions</h2>
//         <Transactions list={tx} />
//       </section>

//       {/* Add Money Modal */}
//       {showAddMoney && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//           <motion.div
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative"
//           >
//             <button
//               onClick={() => setShowAddMoney(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
//             >
//               ✖
//             </button>

//             <h2 className="text-2xl font-bold mb-6 text-center">💳 Add Money</h2>

//             <input
//               type="number"
//               placeholder="Enter amount in ₹"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
//               className="input w-full mb-2 border p-3 rounded-xl"
//               min="1"
//               max="50000"
//             />

//             {amount && (parseInt(amount, 10) <= 0 || parseInt(amount, 10) > 50000) && (
//               <p className="text-red-500 text-sm mb-3">
//                 Amount must be between ₹1 and ₹50,000
//               </p>
//             )}

//             <button
//               onClick={handleAddMoney}
//               disabled={!amount || parseInt(amount, 10) <= 0 || parseInt(amount, 10) > 50000}
//               className={`w-full py-3 rounded-xl text-lg shadow-md transition ${
//                 !amount || parseInt(amount, 10) <= 0 || parseInt(amount, 10) > 50000
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700 text-white"
//               }`}
//             >
//               Add Now
//             </button>

//             <p className="text-xs text-gray-500 mt-3 text-center">
//               Maximum wallet top-up limit: ₹50,000
//             </p>
//           </motion.div>
//         </div>
//       )}

//       {/* Toast */}
//       <Toast message={toast.message} type={toast.type} show={toast.show} onClose={() => setToast({ ...toast, show: false })} />
//     </div>
//   );
// }
