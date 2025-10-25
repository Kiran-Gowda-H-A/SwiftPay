
import { Link } from 'react-router-dom'; import { Plus, Send, Store, Receipt } from 'lucide-react';
export default function QuickActions({ onAddMoney }){
  const items = [
    { label:'Add Money', icon:<Plus/>, onClick:onAddMoney },
    { label:'Send Money', icon:<Send/>, to:'/send' },
    { label:'Pay Merchant', icon:<Store/>, to:'/merchant' },
    { label:'Pay Bill', icon:<Receipt/>, to:'/bills' },
  ];
  return (<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {items.map((it,i)=> it.to ? (
      <Link key={i} to={it.to} className="card flex items-center gap-3 hover:shadow-lg">
        <div className="h-10 w-10 rounded-xl bg-gray-100 grid place-content-center">{it.icon}</div><div className="font-medium">{it.label}</div>
      </Link>
    ) : (
      <button key={i} onClick={it.onClick} className="card flex items-center gap-3 hover:shadow-lg">
        <div className="h-10 w-10 rounded-xl bg-gray-100 grid place-content-center">{it.icon}</div><div className="font-medium">{it.label}</div>
      </button>
    ))}
  </div>);
}
