import { Building2, Sparkles } from "lucide-react";

export default function EmptyCompaniesState() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-14">

      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center">

        <div className="rounded-full bg-blue-600/20 p-6">
          <Building2
            size={52}
            className="text-blue-400"
          />
        </div>

        <h2 className="mt-8 text-3xl font-bold text-white">
          Choose a Target Role
        </h2>

        <p className="mt-4 max-w-xl leading-8 text-slate-400">
          Select your preferred career role and let our AI recommend
          companies that best match your skills, interests, and future
          career goals.
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-3">

          <Sparkles
            size={18}
            className="text-blue-400"
          />

          <span className="text-sm font-medium text-blue-300">
            AI-Powered Career Recommendations
          </span>

        </div>

      </div>

    </div>
  );
}