import Card from "../../ui/Card";
import { Sparkles } from "lucide-react";

const recommendations = [
  "Complete your profile to 100%.",
  "Upload your resume for ATS analysis.",
  "Add at least 5 technical skills.",
  "Add one project to improve visibility.",
];

const RecommendationCard = () => {
  return (
    <Card className="h-full">
      <div className="mb-5 flex items-center gap-2">
        <Sparkles className="text-yellow-400" size={22} />
        <h2 className="text-xl font-semibold text-white">
          AI Recommendations
        </h2>
      </div>

      <div className="space-y-3">
        {recommendations.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-700 bg-slate-800 p-4 text-slate-300"
          >
            {item}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecommendationCard;