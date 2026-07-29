import {
  Briefcase,
  BarChart3,
  ListChecks,
  Sparkles,
} from "lucide-react";

export default function InterviewSetup({
  role,
  setRole,
  difficulty,
  setDifficulty,
  questionCount,
  setQuestionCount,
  loading,
  onGenerate,
}) {
  const roles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Analyst",
    "Data Scientist",
    "AI Engineer",
    "Machine Learning Engineer",
    "DevOps Engineer",
    "Cloud Engineer",
    "Cyber Security Analyst",
    "Java Developer",
    "Python Developer",
  ];

  const difficulties = [
    "Easy",
    "Medium",
    "Hard",
  ];

  const counts = [5, 10, 15];

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl">

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-white">
          Interview Setup
        </h2>

        <p className="mt-2 text-slate-400">
          Customize your AI interview before generating
          questions.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-3">

        {/* Role */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">

            <Briefcase size={16} />

            Target Role

          </label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            {roles.map((item) => (
              <option key={item}>
                {item}
              </option>
            ))}
          </select>

        </div>

        {/* Difficulty */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">

            <BarChart3 size={16} />

            Difficulty

          </label>

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            {difficulties.map((item) => (
              <option key={item}>
                {item}
              </option>
            ))}
          </select>

        </div>

        {/* Questions */}

        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">

            <ListChecks size={16} />

            Questions

          </label>

          <select
            value={questionCount}
            onChange={(e) =>
              setQuestionCount(Number(e.target.value))
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            {counts.map((count) => (
              <option key={count} value={count}>
                {count} Questions
              </option>
            ))}
          </select>

        </div>

      </div>

      <div className="mt-10 flex justify-end">

        <button
          onClick={onGenerate}
          disabled={loading}
          className="inline-flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Sparkles size={18} />

          {loading
            ? "Generating Interview..."
            : "Generate Interview"}
        </button>

      </div>

    </div>
  );
}