import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Card from "../../ui/Card";

const recommendations = [
  {
    title: "Complete your profile",
    desc: "Reach 100% profile completion to improve recruiter visibility.",
  },
  {
    title: "Upload your resume",
    desc: "Get an ATS score and AI-powered resume suggestions.",
  },
  {
    title: "Add technical skills",
    desc: "Include at least 5 relevant technologies for better matching.",
  },
  {
    title: "Showcase projects",
    desc: "Projects significantly improve placement opportunities.",
  },
];

const RecommendationCard = () => {
  return (
    <Card className="h-full">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 p-3">
          <Sparkles className="text-white" size={22} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            AI Insights
          </h2>

          <p className="text-sm text-slate-400">
            Personalized recommendations for your placement journey
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{
              x: 6,
            }}
            transition={{
              duration: 0.2,
            }}
            className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all duration-300 hover:border-violet-500/40 hover:bg-slate-800"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {item.desc}
                </p>
              </div>

              <ArrowRight
                size={18}
                className="text-slate-500 transition group-hover:text-violet-400"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default RecommendationCard;