import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
} from "lucide-react";

export default function CompanyCard({
  company,
}) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900 p-7 transition hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10">

      <div className="flex items-start justify-between">

        <div>

          <div className="flex items-center gap-3">

            <Building2
              className="text-blue-400"
              size={24}
            />

            <h2 className="text-2xl font-bold text-white">
              {company.company}
            </h2>

          </div>

          <p className="mt-4 text-lg font-semibold text-blue-400">
            {company.package}
          </p>

        </div>

        <div className="rounded-full bg-green-500/20 px-4 py-2 text-green-400">
          {company.hiring}
        </div>

      </div>

      <div className="mt-6">

        <h3 className="font-semibold text-white">
          Why AI Recommended
        </h3>

        <p className="mt-2 leading-7 text-slate-400">
          {company.reason}
        </p>

      </div>

      <div className="mt-6 flex flex-wrap gap-2">

        {company.required_skills.map((skill) => (
          <div
            key={skill}
            className="flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300"
          >
            <BadgeCheck
              size={14}
              className="text-green-400"
            />
            {skill}
          </div>
        ))}

      </div>

      <a
        href={company.career_url}
        target="_blank"
        rel="noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        Apply Now
        <ArrowUpRight size={18} />
      </a>

    </div>
  );
}