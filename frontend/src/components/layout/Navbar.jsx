import {
  Bell,
  Search,
  Moon,
  UserCircle,
  LogOut,
} from "lucide-react";

import { logout } from "../../services/logout";

const Navbar = ({ user }) => {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-8">
      <div className="relative w-96">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white">
          <Bell size={20} />
        </button>

        <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white">
          <Moon size={20} />
        </button>

        <button
          onClick={logout}
          className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={20} />
        </button>

        <div className="flex items-center gap-3 rounded-xl bg-slate-900 px-3 py-2">
          <UserCircle className="text-blue-500" size={34} />

          <div>
            <p className="font-medium text-white">
              {user?.full_name}
            </p>

            <p className="text-xs text-slate-400">
              Student
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;