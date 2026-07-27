import { Sparkles } from "lucide-react";

export default function ResumeScoreCard({ score = 0, rating = "" }) {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = Math.min(Math.max(score, 0), 100);

  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  let color = "#22c55e";
  let message =
    "Outstanding ATS compatibility. Your resume is well optimized for recruiter screening.";

  if (score < 60) {
    color = "#ef4444";
    message =
      "Your resume requires additional optimization before it becomes competitive for modern ATS systems.";
  } else if (score < 75) {
    color = "#f59e0b";
    message =
      "Your resume is average. Improving keywords, measurable achievements and technical skills can significantly increase your ATS score.";
  } else if (score < 90) {
    color = "#3b82f6";
    message =
      "Good ATS compatibility. A few targeted improvements can make your resume recruiter ready.";
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-900 to-slate-950 p-10 shadow-2xl">

      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              ATS SCORE
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Resume Health
            </h2>
          </div>

          <div
            className="rounded-full px-5 py-2 text-sm font-semibold"
            style={{
              background: `${color}20`,
              color,
            }}
          >
            {rating}
          </div>

        </div>

        <div className="flex justify-center">

          <div className="relative">

            <svg
              width="210"
              height="210"
              className="-rotate-90"
            >
              <circle
                cx="105"
                cy="105"
                r={normalizedRadius}
                stroke="#1e293b"
                strokeWidth={stroke}
                fill="none"
              />

              <circle
                cx="105"
                cy="105"
                r={normalizedRadius}
                stroke={color}
                strokeWidth={stroke}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transition:
                    "stroke-dashoffset 1.2s ease",
                }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">

              <h1
                className="text-6xl font-extrabold"
                style={{ color }}
              >
                {score}
              </h1>

              <span className="mt-1 text-lg text-slate-300">
                %
              </span>

            </div>

          </div>

        </div>

        <div className="mt-10">

          <div className="mb-2 flex justify-between text-sm text-slate-400">
            <span>ATS Optimization</span>
            <span>{score}%</span>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${score}%`,
                background: color,
              }}
            />

          </div>

        </div>

        <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-800/60 p-6">

          <div className="flex items-center gap-2">

            <Sparkles
              className="text-blue-400"
              size={20}
            />

            <h3 className="font-semibold text-white">
              AI Insight
            </h3>

          </div>

          <p className="mt-4 leading-8 text-slate-400">
            {message}
          </p>

        </div>

      </div>

    </div>
  );
}