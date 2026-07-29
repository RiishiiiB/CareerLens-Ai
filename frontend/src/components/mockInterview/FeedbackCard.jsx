import {
  CheckCircle2,
  AlertCircle,
  Award,
  ArrowRight,
} from "lucide-react";

export default function FeedbackCard({
  feedback,
  onNext,
  isLastQuestion,
}) {
  if (!feedback) return null;

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl">

      {/* Score */}

      <div className="mb-8 flex items-center gap-4">

        <div className="rounded-2xl bg-blue-500/10 p-4">

          <Award
            size={30}
            className="text-blue-400"
          />

        </div>

        <div>

          <p className="text-slate-400">
            AI Evaluation
          </p>

          <h2 className="text-3xl font-bold text-white">
            {feedback.score}/10
          </h2>

        </div>

      </div>

      {/* Strengths */}

      <div className="mb-8 rounded-2xl border border-green-500/20 bg-green-500/5 p-6">

        <div className="mb-4 flex items-center gap-2">

          <CheckCircle2
            className="text-green-400"
            size={22}
          />

          <h3 className="text-lg font-semibold text-white">
            Strengths
          </h3>

        </div>

        <ul className="space-y-2 text-slate-300">

          {(feedback.strengths || []).map((item, index) => (
            <li key={index}>
              • {item}
            </li>
          ))}

        </ul>

      </div>

      {/* Weaknesses */}

      <div className="mb-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6">

        <div className="mb-4 flex items-center gap-2">

          <AlertCircle
            className="text-yellow-400"
            size={22}
          />

          <h3 className="text-lg font-semibold text-white">
            Areas to Improve
          </h3>

        </div>

        <ul className="space-y-2 text-slate-300">

          {(feedback.improvements || []).map((item, index) => (
            <li key={index}>
              • {item}
            </li>
          ))}

        </ul>

      </div>

      {/* Suggested Answer */}

      {feedback.suggested_answer && (

        <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-950 p-6">

          <h3 className="mb-4 text-lg font-semibold text-white">
            Suggested Answer
          </h3>

          <p className="leading-8 text-slate-300">
            {feedback.suggested_answer}
          </p>

        </div>

      )}

      {/* Button */}

      <div className="flex justify-end">

        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
        >
          {isLastQuestion
            ? "Finish Interview"
            : "Next Question"}

          <ArrowRight size={18} />

        </button>

      </div>

    </div>
  );
}