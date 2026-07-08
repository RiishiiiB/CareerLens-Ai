import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { analyzeSkillGap } from "../services/aiService";
import { getCurrentUser } from "../services/authService";
import SkillScoreCard from "../components/skillgap/SkillScoreCard";
const roles = {
  "Frontend Developer": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Redux",
    "Tailwind CSS",
    "Git",
  ],
  "Backend Developer": [
    "Python",
    "FastAPI",
    "PostgreSQL",
    "Docker",
    "Redis",
    "JWT",
  ],
  "Full Stack Developer": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "FastAPI",
    "PostgreSQL",
    "Docker",
    "Git",
  ],
  "Data Analyst": [
    "Python",
    "SQL",
    "Excel",
    "Power BI",
    "Pandas",
    "NumPy",
  ],
  "AI Engineer": [
    "Python",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "FastAPI",
  ],
};

export default function SkillGap() {
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();
  }, []);

  const handleAnalyze = async () => {
    if (!role) return;

    setLoading(true);

    try {
      const data = await analyzeSkillGap({
        target_skills: roles[role],
      });

      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Skill Gap Analysis
          </h1>

          <p className="mt-2 text-slate-400">
            Compare your current skills with your target career.
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

            {Object.keys(roles).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            onClick={handleAnalyze}
            disabled={loading || !role}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Skill Gap"}
          </button>
        </div>

       {result && (
  <>
    <SkillScoreCard score={result.match_score} />

    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl border border-green-500/30 bg-slate-900 p-6">
        <h2 className="mb-4 text-xl font-bold text-green-400">
          Matched Skills
        </h2>

        <ul className="space-y-3">
          {result.matched_skills.map((skill) => (
            <li key={skill} className="text-slate-300">
              • {skill}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-red-500/30 bg-slate-900 p-6">
        <h2 className="mb-4 text-xl font-bold text-red-400">
          Missing Skills
        </h2>

        <ul className="space-y-3">
          {result.missing_skills.map((skill) => (
            <li key={skill} className="text-slate-300">
              • {skill}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-yellow-500/30 bg-slate-900 p-6">
        <h2 className="mb-4 text-xl font-bold text-yellow-400">
          Recommendations
        </h2>

        <ul className="space-y-3">
          {result.recommendations.map((item, index) => (
            <li key={index} className="text-slate-300">
              • {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </>
)}
      </div>
    </DashboardLayout>
  );
}