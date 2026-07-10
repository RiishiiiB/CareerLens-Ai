import { useState } from "react";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import { generateCompanyRecommendations } from "../services/aiService";

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "AI Engineer",
  "Data Engineer",
  "DevOps Engineer",
];

export default function Companies() {
  const [role, setRole] = useState("");
  const [companies, setCompanies] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!role) {
      toast.error("Please select a target role");
      return;
    }

    try {
      setLoading(true);

      const data = await generateCompanyRecommendations(role);

      setCompanies(data);

      toast.success("Company recommendations generated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white">
            AI Company Recommendations
          </h1>

          <p className="mt-2 text-slate-400">
            Discover companies that best match your career goals.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <label className="mb-3 block text-sm font-medium text-slate-300">
            Target Role
          </label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none"
          >
            <option value="">Select Target Role</option>

            {roles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Generating..."
              : "Generate Recommendations"}
          </button>
        </div>

        {companies && (
          <div className="grid gap-6 lg:grid-cols-2">
            {companies.companies.map((company) => (
              <div
                key={company.company}
                className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {company.company}
                  </h2>

                  <span className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white">
                    {company.hiring}
                  </span>
                </div>

                <p className="mt-4 text-blue-400 font-semibold">
                  {company.package}
                </p>

                <p className="mt-4 text-slate-300">
                  {company.reason}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {company.required_skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <a
                  href={company.career_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}