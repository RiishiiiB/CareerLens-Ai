import {
  Brain,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function LoadingInterview() {
  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl">

      <div className="flex flex-col items-center text-center">

        <div className="mb-6 rounded-full bg-blue-500/10 p-5">

          <Brain
            size={42}
            className="text-blue-400"
          />

        </div>

        <h2 className="text-3xl font-bold text-white">
          Preparing Your Interview
        </h2>

        <p className="mt-3 max-w-xl text-slate-400">
          Our AI is analyzing your selected role and
          generating realistic interview questions.
          This will only take a few seconds.
        </p>

        <div className="mt-8 flex items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 px-5 py-3">

          <Loader2
            size={20}
            className="animate-spin text-blue-400"
          />

          <span className="font-medium text-blue-300">
            AI is generating your interview...
          </span>

        </div>

      </div>

      {/* Skeleton Questions */}

      <div className="mt-10 space-y-6">

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-slate-700 bg-slate-950/70 p-6"
          >
            <div className="mb-4 h-5 w-40 animate-pulse rounded bg-slate-700" />

            <div className="mb-3 h-4 w-full animate-pulse rounded bg-slate-800" />

            <div className="mb-3 h-4 w-11/12 animate-pulse rounded bg-slate-800" />

            <div className="h-4 w-8/12 animate-pulse rounded bg-slate-800" />
          </div>
        ))}

      </div>

      {/* Footer */}

      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">

        <Sparkles size={16} />

        Creating personalized interview questions using AI

      </div>

    </div>
  );
}