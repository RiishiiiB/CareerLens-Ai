import { Briefcase, Sparkles } from "lucide-react";

export default function CompanyFilter({
  role,
  setRole,
  roles,
  loading,
  onGenerate,
}) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8">

      <div className="mb-6 flex items-center gap-3">

        <div className="rounded-xl bg-blue-600/20 p-3">
          <Briefcase
            className="text-blue-400"
            size={24}
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            Target Role
          </h2>

          <p className="text-sm text-slate-400">
            Choose your desired career path and let AI recommend the best companies.
          </p>
        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_auto]">

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-white outline-none transition focus:border-blue-500"
        >
          <option value="">Select Target Role</option>

          {roles.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        <button
          onClick={onGenerate}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles size={18} />

          {loading
            ? "Generating..."
            : "Generate AI Recommendations"}
        </button>

      </div>

    </div>
  );
}