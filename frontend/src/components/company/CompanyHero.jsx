import { Building2, Sparkles } from "lucide-react";

export default function CompanyHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-10">

      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10">

        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-blue-600/20 p-4">
            <Building2 className="text-blue-400" size={34} />
          </div>

          <div>

            <h1 className="text-4xl font-bold text-white">
              AI Company Explorer
            </h1>

            <p className="mt-2 text-slate-400">
              Discover companies that best match your skills,
              career goals and resume profile.
            </p>

          </div>

        </div>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2">

          <Sparkles
            className="text-blue-400"
            size={18}
          />

          <span className="text-sm text-blue-300">
            Powered by Gemini AI
          </span>

        </div>

      </div>

    </div>
  );
}