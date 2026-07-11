import {
  UserCheck,
  FileText,
  Brain,
  Briefcase,
} from "lucide-react";

import StatCard from "./cards/StatCard";

const StatsGrid = ({ profile }) => {
  const completion = profile ? "100%" : "0%";

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Profile"
        value={completion}
        subtitle="Completion"
        icon={UserCheck}
      />

      <StatCard
        title="Resume"
        value="Ready"
        subtitle="Uploaded"
        icon={FileText}
      />

      <StatCard
        title="AI Modules"
        value="4"
        subtitle="Completed"
        icon={Brain}
      />

      <StatCard
        title="Placement Hub"
        value="Live"
        subtitle="Applications Active"
        icon={Briefcase}
      />

    </div>
  );
};

export default StatsGrid;