
// export default function Transactions({list=[]}){
//   if(!list.length) return <div className="card text-sm text-gray-500">No transactions yet.</div>;
//   return (<div className="card">
//     <div className="flex items-center justify-between mb-3"><h3 className="font-semibold">Recent Transactions</h3></div>
//     <ul className="divide-y">
//       {list.map(t=>(
//         <li key={t.id} className="py-3 flex items-center justify-between">
//           <div>
//             <div className="font-medium">{t.ttype.replaceAll('_',' ')}</div>
//             <div className="text-xs text-gray-500">{new Date(t.created_at*1000).toLocaleString()}</div>
//             <div className="text-xs"><span className={`pill ${t.ttype.includes('credit')?'bg-green-100 text-green-700':'bg-gray-100 text-gray-700'}`}>{t.ttype.includes('credit')?'Credited':'Debited'}</span></div>
//           </div>
//           <div className={`font-semibold ${t.ttype.includes('credit')?'text-green-600':'text-gray-800'}`}>₹{(t.amount_cents/100).toFixed(2)}</div>
//         </li>
//       ))}
//     </ul>
//   </div>);
// }
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export default function Transactions({ list = [] }) {
  if (!list.length)
    return (
      <div className="card text-sm text-gray-500">No transactions yet.</div>
    );

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Recent Transactions</h3>
      </div>

      <ul className="divide-y">
        {list.map((t) => {
          const isCredit = t.ttype.includes("credit");
          return (
            <li
              key={t.id}
              className="py-3 flex items-center justify-between gap-4"
            >
              {/* Left side */}
              <div className="flex items-start gap-3">
                {isCredit ? (
                  <ArrowDownCircle className="w-6 h-6 text-green-600 mt-1" />
                ) : (
                  <ArrowUpCircle className="w-6 h-6 text-red-600 mt-1" />
                )}
                <div className="space-y-1">
                  <div className="font-medium capitalize">
                    {t.ttype.replaceAll("_", " ")}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(t.created_at * 1000).toLocaleString()}
                  </div>
                  <div>
                    <span
                      className={`pill ${
                        isCredit
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isCredit ? "Credited" : "Debited"}
                    </span>
                  </div>
                  {/* Extra details always visible */}
                  {t.meta && (
                    <div className="text-xs text-gray-600 mt-1 break-words">
                      {JSON.stringify(t.meta)}
                    </div>
                  )}
                </div>
              </div>

              {/* Right side (amount) */}
              <div
                className={`font-semibold text-right ${
                  isCredit ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{(t.amount_cents / 100).toFixed(2)}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
