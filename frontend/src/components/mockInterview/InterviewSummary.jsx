import {
  Trophy,
  CheckCircle2,
  AlertCircle,
 RotateCcw,
  Download,
} from "lucide-react";

export default function InterviewSummary({
  summary,
  onRestart,
  onDownload,
}) {
  if (!summary) return null;

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl">

      {/* Header */}

      <div className="text-center">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10">

          <Trophy
            size={40}
            className="text-blue-400"
          />

        </div>

        <h1 className="text-4xl font-bold text-white">
          Interview Complete 🎉
        </h1>

        <p className="mt-3 text-slate-400">
          Here's your overall AI interview report.
        </p>

      </div>

      {/* Score */}

      <div className="my-10 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-8 text-center">

        <p className="text-slate-400">
          Overall Score
        </p>

        <h2 className="mt-3 text-6xl font-bold text-blue-400">
          {summary.score}%
        </h2>

      </div>

      {/* Grid */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Strengths */}

        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">

          <div className="mb-4 flex items-center gap-2">

            <CheckCircle2
              size={22}
              className="text-green-400"
            />

            <h3 className="text-xl font-semibold text-white">
              Strengths
            </h3>

          </div>

          <ul className="space-y-3 text-slate-300">

            {(summary.strengths || []).map((item, index) => (
              <li key={index}>
                • {item}
              </li>
            ))}

          </ul>

        </div>

        {/* Improvements */}

        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6">

          <div className="mb-4 flex items-center gap-2">

            <AlertCircle
              size={22}
              className="text-yellow-400"
            />

            <h3 className="text-xl font-semibold text-white">
              Areas to Improve
            </h3>

          </div>

          <ul className="space-y-3 text-slate-300">

            {(summary.improvements || []).map((item, index) => (
              <li key={index}>
                • {item}
              </li>
            ))}

          </ul>

        </div>

      </div>

      {/* Recommendation */}

      {summary.recommendation && (

        <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-950 p-6">

          <h3 className="mb-4 text-xl font-semibold text-white">
            AI Recommendation
          </h3>

          <p className="leading-8 text-slate-300">
            {summary.recommendation}
          </p>

        </div>

      )}

      {/* Buttons */}

      <div className="mt-10 flex flex-wrap justify-end gap-4">

        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 font-medium text-white transition hover:bg-slate-800"
        >

          <RotateCcw size={18} />

          Restart Interview

        </button>

        <button
          onClick={onDownload}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
        >

          <Download size={18} />

          Download Report

        </button>

      </div>

    </div>
  );
}