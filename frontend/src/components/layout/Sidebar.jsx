import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  Brain,
  Map,
  Building2,
  Briefcase,
  Mic,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    name: "Resume Analyzer",
    path: "/resume-analyzer",
    icon: FileText,
  },
  {
    name: "Skill Gap",
    path: "/skill-gap",
    icon: Brain,
  },
  {
    name: "Career Roadmap",
    path: "/career-roadmap",
    icon: Map,
  },
  {
    name: "Companies",
    path: "/companies",
    icon: Building2,
  },
  {
    name: "Applications",
    path: "/applications",
    icon: Briefcase,
  },
  {
    name: "Mock Interview",
    path: "/mock-interview",
    icon: Mic,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  return (
    <aside className="w-72 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="px-8 py-8 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white">
          CareerLens AI
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          AI Career Assistant
        </p>
      </div>

      <nav className="flex-1 p-5 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;