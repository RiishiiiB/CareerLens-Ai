import {
  HelpCircle,
  Send,
  ArrowRight,
} from "lucide-react";

export default function InterviewQuestion({
  questionNumber,
  totalQuestions,
  question,
  answer,
  setAnswer,
  onSubmit,
  loading,
}) {
  const progress =
    (questionNumber / totalQuestions) * 100;

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl">

      {/* Progress */}

      <div className="mb-8">

        <div className="mb-3 flex items-center justify-between">

          <span className="text-sm font-medium text-blue-400">
            Question {questionNumber} of {totalQuestions}
          </span>

          <span className="text-sm text-slate-400">
            {Math.round(progress)}%
          </span>

        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-700">

          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />

        </div>

      </div>

      {/* Question */}

      <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-6">

        <div className="mb-4 flex items-center gap-3">

          <div className="rounded-xl bg-blue-500/10 p-3">

            <HelpCircle
              size={22}
              className="text-blue-400"
            />

          </div>

          <h2 className="text-xl font-bold text-white">
            Interview Question
          </h2>

        </div>

        <p className="text-lg leading-8 text-slate-300">
          {question}
        </p>

      </div>

      {/* Answer */}

      <div className="mt-8">

        <label className="mb-3 block text-sm font-medium text-slate-300">
          Your Answer
        </label>

        <textarea
          rows={8}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your answer here..."
          className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />

      </div>

      {/* Button */}

      <div className="mt-8 flex justify-end">

        <button
          onClick={onSubmit}
          disabled={loading || !answer.trim()}
          className="inline-flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {loading ? (
            <>
              <Send size={18} />
              Evaluating...
            </>
          ) : (
            <>
              Submit Answer
              <ArrowRight size={18} />
            </>
          )}

        </button>

      </div>

    </div>
  );
}