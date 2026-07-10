import { motion } from "framer-motion";
import {
  Sparkles,
  FileText,
  Brain,
  Map,
  Building2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI Resume Analysis",
  },
  {
    icon: Brain,
    title: "Skill Gap Detection",
  },
  {
    icon: Map,
    title: "Career Roadmaps",
  },
  {
    icon: Building2,
    title: "Company Recommendations",
  },
];

export default function AuthHero() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="hidden lg:flex flex-col justify-between h-full"
    >
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/10 px-5 py-2 text-sm font-medium text-[#FFD166]">
          <Sparkles size={16} />
          CareerLens AI Platform
        </div>

        <h1 className="mt-8 text-7xl font-black leading-none text-white">
          Build
          <br />
          Your
          <br />
          <span className="text-[#FF6B35]">
            Dream Career
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">
          Your intelligent career companion that analyzes your resume,
          identifies missing skills, creates personalized roadmaps and
          recommends the right companies to accelerate your journey.
        </p>

        <div className="mt-10 space-y-4">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                whileHover={{
                  x: 8,
                  scale: 1.02,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-[#151515]/80 px-5 py-4 backdrop-blur-xl"
              >
                <div className="rounded-xl bg-[#FF6B35]/10 p-3 transition group-hover:bg-[#FF6B35]/20">
                  <Icon
                    size={20}
                    className="text-[#FF6B35]"
                  />
                </div>

                <span className="font-medium text-slate-200">
                  {item.title}
                </span>

                <ArrowRight
                  size={18}
                  className="ml-auto text-[#D9FF00] opacity-0 transition group-hover:opacity-100"
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-14 grid grid-cols-3 gap-5">

        <div className="rounded-2xl border border-white/5 bg-[#151515]/80 p-6 text-center backdrop-blur-xl">
          <ShieldCheck
            className="mx-auto text-[#D9FF00]"
            size={28}
          />

          <h2 className="mt-3 text-3xl font-black text-white">
            ATS
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Optimized
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#151515]/80 p-6 text-center backdrop-blur-xl">
          <h2 className="text-3xl font-black text-[#FF6B35]">
            AI
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Career Mentor
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#151515]/80 p-6 text-center backdrop-blur-xl">
          <h2 className="text-3xl font-black text-[#FFD166]">
            24/7
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Available
          </p>
        </div>

      </div>
    </motion.div>
  );
}