import {
  PlusCircle,
  GraduationCap,
  FolderKanban,
  Award,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../../ui/Card";

const actions = [
  {
    title: "Add Skill",
    path: "/profile",
    icon: PlusCircle,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Education",
    path: "/profile",
    icon: GraduationCap,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Projects",
    path: "/profile",
    icon: FolderKanban,
    color: "from-purple-500 to-fuchsia-500",
  },
  {
    title: "Certificates",
    path: "/profile",
    icon: Award,
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Resume",
    path: "/resume",
    icon: FileText,
    color: "from-red-500 to-pink-500",
  },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card className="lg:col-span-1">
      <h2 className="mb-6 text-xl font-bold text-white">
        ⚡ Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
              }}
              whileHover={{
                y: -5,
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={() => navigate(action.path)}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-all duration-300 hover:border-blue-500/40 hover:bg-slate-800"
            >
              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${action.color} shadow-lg`}
              >
                <Icon
                  size={26}
                  className="text-white"
                />
              </div>

              <p className="mt-4 text-sm font-semibold text-white">
                {action.title}
              </p>
            </motion.button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;