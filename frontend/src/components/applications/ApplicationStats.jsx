import {
  Briefcase,
  Clock3,
  Users,
  Trophy,
  XCircle,
} from "lucide-react";

export default function ApplicationStats({
  applications = [],
}) {
  const total = applications.length;

  const applied = applications.filter(
    (a) => a.status === "Applied"
  ).length;

  const interview = applications.filter(
    (a) => a.status === "Interview"
  ).length;

  const offer = applications.filter(
    (a) => a.status === "Offer"
  ).length;

  const rejected = applications.filter(
    (a) => a.status === "Rejected"
  ).length;

  const stats = [
    {
      title: "Total",
      value: total,
      icon: Briefcase,
      iconColor: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Applied",
      value: applied,
      icon: Clock3,
      iconColor: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Interview",
      value: interview,
      icon: Users,
      iconColor: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Offer",
      value: offer,
      icon: Trophy,
      iconColor: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Rejected",
      value: rejected,
      icon: XCircle,
      iconColor: "text-red-400",
      bg: "bg-red-500/10",
    },
  ];

  return (
    <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="group rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-blue-500/10"
          >
            <div className="flex items-start justify-between">
              <div
                className={`rounded-xl p-3 ${stat.bg}`}
              >
                <Icon
                  className={stat.iconColor}
                  size={24}
                />
              </div>

              <h2 className="text-3xl font-bold text-white">
                {stat.value}
              </h2>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-400">
              {stat.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}