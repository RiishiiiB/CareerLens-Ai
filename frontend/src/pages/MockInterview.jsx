import { useState } from "react";
import mockInterviewService from "../services/mockInterviewService";

export default function MockInterview() {
  const [role, setRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [interview, setInterview] = useState(null);

  const generateInterview = async () => {
    try {
      setLoading(true);

      const data = await mockInterviewService.generateInterview({
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
    <div className="min-h-screen bg-[#090909] p-8">
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
            className="rounded-xl border border-white/10 bg-[#151515] p-3 text-white"
          >
            <option>Software Engineer</option>
            <option>Data Analyst</option>
            <option>Data Scientist</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#151515] p-3 text-white"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

        </div>

        <button
          onClick={generateInterview}
          disabled={loading}
          className="mt-6 rounded-xl bg-[#FF6B35] px-6 py-3 font-semibold text-white transition hover:bg-[#ff824f]"
        >
          {loading ? "Generating..." : "Generate Interview"}
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
  );
}