import { Building2, Briefcase, IndianRupee, Target } from "lucide-react";

export default function CompanyStats({
  companies = [],
  role,
}) {
     const companyList = Array.isArray(companies)
    ? companies
    : [];

  const hiring = companyList.filter(
    (c) => c.hiring?.toLowerCase() === "open"
  ).length;

  return (
    <div className="grid gap-6 md:grid-cols-4">

      <StatCard
        icon={<Building2 size={24} />}
        title="Companies"
        value={companyList.length}
      />

      <StatCard
        icon={<Briefcase size={24} />}
        title="Hiring"
        value={hiring}
      />

      <StatCard
        icon={<IndianRupee size={24} />}
        title="Avg Package"
        value="AI"
      />

      <StatCard
        icon={<Target size={24} />}
        title="Role"
        value={role || "--"}
      />

    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

      <div className="mb-4 text-blue-400">
        {icon}
      </div>

      <p className="text-slate-400">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold text-white">
        {value}
      </h2>

    </div>
  );
}