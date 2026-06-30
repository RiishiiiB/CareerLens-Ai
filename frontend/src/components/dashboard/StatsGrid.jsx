import {
  UserCheck,
  FileText,
  Brain,
  Building2,
} from "lucide-react";

import StatCard from "./cards/StatCard";

const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
  title="Portfolio Strength"
  value="★★☆☆☆"
  subtitle="Basic"
  icon={UserCheck}
/>

      <StatCard
        title="Resume Score"
        value="--"
        subtitle="Coming Soon"
        icon={FileText}
      />

      <StatCard
        title="Skill Gap"
        value="--"
        subtitle="Coming Soon"
        icon={Brain}
      />

      <StatCard
        title="Eligible Companies"
        value="--"
        subtitle="Coming Soon"
        icon={Building2}
      />
    </div>
  );
};

export default StatsGrid;