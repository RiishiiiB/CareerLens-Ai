import Card from "../../ui/Card";
import { Clock3, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const activities = [
  {
    title: "Logged into CareerLens AI",
    time: "Just now",
  },
  {
    title: "Updated Student Profile",
    time: "Today",
  },
  {
    title: "Completed 40% Profile",
    time: "Today",
  },
  {
    title: "Resume Uploaded",
    time: "Yesterday",
  },
];

const RecentActivity = () => {
  return (
    <Card className="mt-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-blue-500/15 p-3">
          <Clock3
            size={22}
            className="text-blue-400"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            Recent Activity
          </h2>

          <p className="text-sm text-slate-400">
            Your latest actions across CareerLens AI
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: index * 0.08,
            }}
            className="group flex items-start gap-4"
          >
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-green-500/15 p-2">
                <CheckCircle2
                  size={18}
                  className="text-green-400"
                />
              </div>

              {index !== activities.length - 1 && (
                <div className="mt-2 h-10 w-px bg-slate-700" />
              )}
            </div>

            <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all duration-300 group-hover:border-blue-500/30">
              <h3 className="font-medium text-white">
                {activity.title}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {activity.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;