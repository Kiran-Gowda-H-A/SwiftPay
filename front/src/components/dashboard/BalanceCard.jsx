
export default function BalanceCard({amount}){
  return (<div className="card p-0 overflow-hidden">
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
      <div className="text-sm opacity-90">Wallet Balance</div>
      <div className="text-4xl font-bold mt-1">₹{(amount/100).toFixed(2)}</div>
    </div>
    <div className="p-4 text-sm text-gray-500">Instant payments. No hidden fees.</div>
  </div>);
}
