import Link from "next/link";
import { LayoutDashboard, Settings, Activity } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 h-full">
      <div>
        <div className="flex items-center gap-2 px-2 py-4 border-b border-slate-700 mb-6">
          <Activity className="text-emerald-400 h-6 w-6" />
          <span className="font-bold text-lg tracking-wide">Admin Dashboard</span>
        </div>
        
        <nav className="space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 transition">
            <LayoutDashboard size={18} />
            <span>Main Screen</span>
          </Link>
          {/* <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition">
            <Settings size={18} />
            <span>Settings</span>
          </Link> */}
        </nav>
      </div>
      <div className="text-xs text-slate-500 px-2">v1.0.0</div>
    </aside>
  );
}