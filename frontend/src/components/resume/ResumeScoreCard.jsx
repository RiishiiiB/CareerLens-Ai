export default function ResumeScoreCard({ score = 0, rating = "" }) {
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = Math.min(Math.max(score, 0), 100);

  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  let color = "#22c55e";
  let message = "Excellent ATS Compatibility";

  if (score < 60) {
    color = "#ef4444";
    message = "Needs Significant Improvement";
  } else if (score < 75) {
    color = "#f59e0b";
    message = "Average ATS Compatibility";
  } else if (score < 90) {
    color = "#3b82f6";
    message = "Good ATS Compatibility";
  }

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-xl">

      <h2 className="text-center text-sm uppercase tracking-[0.3em] text-slate-400">
        ATS SCORE
      </h2>

      <div className="mt-8 flex flex-col items-center">

        <svg
          width="180"
          height="180"
          className="-rotate-90"
        >
          <circle
            cx="90"
            cy="90"
            r={normalizedRadius}
            stroke="#1e293b"
            strokeWidth={stroke}
            fill="none"
          />

          <circle
            cx="90"
            cy="90"
            r={normalizedRadius}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 1.2s ease",
            }}
          />
        </svg>

        <div className="-mt-28 text-center">

          <h1
            className="text-5xl font-bold"
            style={{ color }}
          >
            {score}
          </h1>

          <p className="mt-1 text-slate-300">
            /100
          </p>

        </div>

        <div
          className="mt-10 rounded-full px-5 py-2 font-semibold"
          style={{
            background: `${color}20`,
            color,
          }}
        >
          {rating}
        </div>

        <p className="mt-6 text-slate-400">
          {message}
        </p>

      </div>

    </div>
  );
}