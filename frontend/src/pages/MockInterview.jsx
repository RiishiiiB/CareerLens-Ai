import { useEffect, useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";
import { getCurrentUser } from "../services/authService";
import mockInterviewService from "../services/mockInterviewService";

export default function MockInterview() {
  const [user, setUser] = useState(null);

  const [role, setRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState("Medium");

  const [loading, setLoading] = useState(false);
  const [interview, setInterview] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error(err);
    }
  }

  const generateInterview = async () => {
    try {
      setLoading(true);

      const data =
        await mockInterviewService.generateInterview({
          role,
          difficulty,
        });

      setInterview(data);
    } catch (err) {
      console.error(err);
      alert("Failed to generate interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="min-h-screen p-8">

        <div className="mx-auto max-w-5xl">

          <h1 className="text-4xl font-bold text-white">
            AI Mock Interview
          </h1>

          <p className="mt-2 text-slate-400">
            Practice before your real interview.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
  backgroundColor: "#0f172a",
  color: "#ffffff",
}}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option>Software Engineer</option>
              <option>Data Analyst</option>
              <option>Data Scientist</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
            </select>

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value)
              }
                     style={{
  backgroundColor: "#0f172a",
  color: "#ffffff",
}}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
            
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

          </div>

          <button
            onClick={generateInterview}
            disabled={loading}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {loading
              ? "Generating..."
              : "Generate Interview"}
          </button>

          {interview && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-[#151515] p-6">

              <h2 className="mb-4 text-2xl font-bold text-white">
                Generated Questions
              </h2>

              <pre className="whitespace-pre-wrap text-slate-300">
                {interview.questions}
              </pre>

            </div>
          )}

        </div>

      </div>
    </DashboardLayout>
  );
}