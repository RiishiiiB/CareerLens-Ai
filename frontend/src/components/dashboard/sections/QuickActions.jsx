import {
  PlusCircle,
  GraduationCap,
  FolderKanban,
  Award,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Card from "../../ui/Card";

const actions = [
  {
    title: "Add Skill",
    path: "/profile",
    icon: PlusCircle,
    color: "text-blue-400",
  },
  {
    title: "Add Education",
    path: "/profile",
    icon: GraduationCap,
    color: "text-green-400",
  },
  {
    title: "Add Project",
    path: "/profile",
    icon: FolderKanban,
    color: "text-purple-400",
  },
  {
    title: "Add Certification",
    path: "/profile",
    icon: Award,
    color: "text-yellow-400",
  },
  {
    title: "Upload Resume",
    path: "/dashboard",
    icon: FileText,
    color: "text-red-400",
  },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <h2 className="mb-6 text-xl font-semibold text-white">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className="group flex flex-col items-center justify-center rounded-xl bg-slate-800 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-700 hover:shadow-lg"
            >
              <Icon
                size={30}
                className={`${action.color} transition-transform duration-300 group-hover:scale-110`}
              />

              <span className="mt-3 text-center text-sm font-medium text-white">
                {action.title}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;