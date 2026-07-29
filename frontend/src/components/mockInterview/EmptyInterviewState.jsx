import {
  Brain,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function EmptyInterviewState({
  onStart,
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/70 p-12 text-center shadow-xl">

      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-500/10">

        <Brain
          size={48}
          className="text-blue-400"
        />

      </div>

      <h2 className="mt-8 text-3xl font-bold text-white">
        Ready for Your AI Mock Interview?
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-400">
        Select your preferred role, difficulty level,
        and number of questions to begin a realistic
        AI-powered interview experience with
        personalized feedback after every answer.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-6">

          <Brain
            size={30}
            className="mx-auto text-blue-400"
          />

          <h3 className="mt-4 text-lg font-semibold text-white">
            AI Generated
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Interview questions tailored
            to your chosen role.
          </p>

        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-6">

          <Sparkles
            size={30}
            className="mx-auto text-yellow-400"
          />

          <h3 className="mt-4 text-lg font-semibold text-white">
            Instant Feedback
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Get AI evaluation after every
            interview response.
          </p>

        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-6">

          <ArrowRight
            size={30}
            className="mx-auto text-green-400"
          />

          <h3 className="mt-4 text-lg font-semibold text-white">
            Improve Faster
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Track your progress and build
            confidence for real interviews.
          </p>

        </div>

      </div>

      <button
        onClick={onStart}
        className="mt-10 inline-flex items-center gap-3 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30"
      >
        Start Your Interview

        <ArrowRight size={20} />
      </button>

    </div>
  );
}