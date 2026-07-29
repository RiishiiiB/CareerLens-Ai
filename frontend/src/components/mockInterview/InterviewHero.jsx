import {
  Brain,
  Sparkles,
  Target,
  ArrowRight,
} from "lucide-react";

export default function InterviewHero({
  onStart,
}) {
  const features = [
    {
      icon: Brain,
      title: "AI Powered",
      description:
        "Generate intelligent interview questions tailored to your role.",
    },
    {
      icon: Target,
      title: "Multiple Roles",
      description:
        "Practice for Software, Data, Frontend, Backend and more.",
    },
    {
      icon: Sparkles,
      title: "Instant Feedback",
      description:
        "Receive AI-generated insights to improve every answer.",
    },
  ];

  return (
    <section className="mb-10 overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-blue-900/30 via-slate-900 to-slate-950 shadow-xl">

      <div className="p-8 lg:p-10">

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div className="max-w-2xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">

              <Brain size={16} />

              AI Interview Simulator

            </div>

            <h1 className="text-4xl font-bold leading-tight text-white lg:text-5xl">
              Ace Your Next
              <span className="text-blue-400">
                {" "}
                Technical Interview
              </span>
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              Practice realistic interview questions,
              receive AI-powered feedback,
              improve your confidence,
              and get ready for your dream job.
            </p>

            <button
              onClick={onStart}
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30"
            >
              Start Interview

              <ArrowRight size={18} />
            </button>

          </div>

          <div className="grid gap-4 lg:w-[420px]">

            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 backdrop-blur transition-all duration-300 hover:border-blue-500/40 hover:bg-slate-900"
                >

                  <div className="flex items-start gap-4">

                    <div className="rounded-xl bg-blue-500/10 p-3">

                      <Icon
                        size={22}
                        className="text-blue-400"
                      />

                    </div>

                    <div>

                      <h3 className="font-semibold text-white">
                        {feature.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {feature.description}
                      </p>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>

    </section>
  );
}