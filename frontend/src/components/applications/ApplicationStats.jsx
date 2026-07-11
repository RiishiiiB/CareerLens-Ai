import { Briefcase, Clock3, Users, Trophy, XCircle } from "lucide-react";

export default function ApplicationStats({ applications }) {
  const total = applications.length;
  const applied = applications.filter(a => a.status === "Applied").length;
  const interview = applications.filter(a => a.status === "Interview").length;
  const offer = applications.filter(a => a.status === "Offer").length;
  const rejected = applications.filter(a => a.status === "Rejected").length;

  const stats = [
    {
      title: "Total",
      value: total,
      icon: Briefcase,
      color: "text-orange-400",
    },
    {
      title: "Applied",
      value: applied,
      icon: Clock3,
      color: "text-yellow-400",
    },
    {
      title: "Interview",
      value: interview,
      icon: Users,
      color: "text-purple-400",
    },
    {
      title: "Offer",
      value: offer,
      icon: Trophy,
      color: "text-green-400",
    },
    {
      title: "Rejected",
      value: rejected,
      icon: XCircle,
      color: "text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-white/10 bg-[#151515] p-5"
          >
            <div className="flex items-center justify-between">
              <Icon className={stat.color} size={22} />
              <span className="text-3xl font-bold text-white">
                {stat.value}
              </span>
            </div>

            <p className="mt-4 text-slate-400">
              {stat.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}