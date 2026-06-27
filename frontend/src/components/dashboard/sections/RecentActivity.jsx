import Card from "../../ui/Card";
import { Clock3 } from "lucide-react";

const activities = [
  "Logged into CareerLens AI",
  "Updated student profile",
  "Completed 40% of profile",
  "Resume Analyzer coming soon",
];

const RecentActivity = () => {
  return (
    <Card className="mt-8">
      <div className="flex items-center gap-2 mb-5">
        <Clock3 className="text-blue-500" size={22} />
        <h2 className="text-xl font-semibold text-white">
          Recent Activity
        </h2>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg bg-slate-800 p-4"
          >
            <span className="text-slate-300">{activity}</span>

            <span className="text-xs text-slate-500">Today</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;