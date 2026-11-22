import { Sparkles, Upload, Brain, ArrowUpRight, Orbit } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../ui/Button";
import ProfileCompletionGauge from "./ProfileCompletionGauge";

const HeroSection = ({ completion = 0, user }) => {
  const navigate = useNavigate();

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
      ? "Good afternoon"
      : "Good evening";

  const safeCompletion = Math.min(100, Math.max(0, completion));

  return (
    <section className="relative isolate mb-8 overflow-hidden rounded-[28px] border border-blue-400/20 bg-[#060d1c] shadow-[0_24px_80px_rgba(0,0,0,0.38)] [perspective:1400px]">
      {/* Ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_12%_0%,rgba(37,99,235,0.22),transparent_42%),radial-gradient(ellipse_at_90%_80%,rgba(249,115,22,0.10),transparent_34%)]" />

      {/* Fine grid texture */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] [background-image:linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:34px_34px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

      {/* Edge lighting */}
      <div className="pointer-events-none absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/60 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative grid gap-10 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center lg:p-10">
        {/* Greeting and actions */}
        <div className="relative z-10 min-w-0">
          <div className="mb-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/[0.07] px-3 py-1.5 text-xs font-medium tracking-wide text-blue-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            CAREER COMMAND CENTER
            <span className="ml-1 hidden h-3 w-px bg-blue-200/20 sm:block" />
            <span className="text-blue-200/70">Your workspace</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-xl border border-blue-300/20 bg-blue-400/10 p-2.5 text-blue-300 shadow-[0_8px_24px_rgba(37,99,235,0.15),inset_0_1px_0_rgba(255,255,255,0.12)]">
              <Sparkles size={22} />
            </div>

            <div className="min-w-0">
              <p className="mb-2 text-sm font-medium tracking-wide text-blue-200/70">
                {greeting}
              </p>
              <h1 className="break-words text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
                {user?.full_name || "there"}
                <span className="ml-2 bg-gradient-to-r from-blue-300 via-cyan-200 to-orange-200 bg-clip-text text-transparent">
                  .
                </span>
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300/80 sm:text-lg">
            Your next opportunity starts here. Build your profile, sharpen
            your resume, and turn your career goals into a plan.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => navigate("/resume")}>
              <Upload size={18} />
              <span className="ml-2">Upload Resume</span>
              <ArrowUpRight className="ml-2 opacity-70" size={16} />
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate("/resume-analyzer")}
            >
              <Brain size={18} />
              <span className="ml-2">Analyze Resume</span>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.08] pt-5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              Personal workspace
            </span>

            <span className="inline-flex items-center gap-2">
              <Orbit size={14} className="text-blue-300" />
              AI-powered career insights
            </span>
          </div>
        </div>

        {/* Dimensional profile panel */}
        <div className="relative mx-auto w-full max-w-[320px] [transform-style:preserve-3d] lg:mx-0 lg:ml-auto">
          {/* Layered decorative rings */}
          <div className="pointer-events-none absolute -inset-4 rounded-[34px] border border-blue-300/[0.08] [transform:translateZ(-24px)_rotate(-5deg)]" />
          <div className="pointer-events-none absolute -inset-2 rounded-[30px] border border-white/[0.06] [transform:translateZ(-12px)_rotate(3deg)]" />

          <div className="relative rounded-[26px] border border-blue-200/15 bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-[#080f20] p-5 shadow-[0_22px_50px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.12)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_65px_rgba(0,0,0,0.48),0_0_30px_rgba(59,130,246,0.10),inset_0_1px_0_rgba(255,255,255,0.15)] sm:p-6">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Profile status
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  Your career foundation
                </p>
              </div>

              <span className="rounded-lg border border-emerald-300/15 bg-emerald-400/[0.08] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                Active
              </span>
            </div>

            <div className="relative my-5 flex items-center justify-center">
              <div className="absolute h-48 w-48 rounded-full bg-blue-500/10 blur-2xl" />
              <div className="absolute h-40 w-40 rounded-full border border-dashed border-blue-200/10" />

              <div className="relative z-10 w-48">
                <ProfileCompletionGauge percentage={completion} />
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-black/20 p-3.5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-slate-300">Profile strength</span>
                <span className="font-semibold text-white">
                  {safeCompletion}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-slate-700/70">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-300 to-orange-300 shadow-[0_0_12px_rgba(96,165,250,0.45)] transition-all duration-700"
                  style={{ width: `${safeCompletion}%` }}
                />
              </div>

              <p className="mt-2 text-[11px] leading-4 text-slate-400">
                Complete your profile to unlock more personalized insights.
              </p>
            </div>
          </div>

          {/* Tiny corner marker */}
          <div className="pointer-events-none absolute -bottom-2 -right-2 h-8 w-8 rounded-br-[18px] border-b border-r border-orange-300/40" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;