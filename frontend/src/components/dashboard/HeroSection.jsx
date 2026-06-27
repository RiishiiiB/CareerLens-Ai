import { Sparkles } from "lucide-react";

const HeroSection = ({ user, profile }) => {
  return (
    <div className="mb-8 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 p-8">
      <div className="flex items-center gap-3">
        <Sparkles className="text-blue-500" size={28} />

        <div>
          <h1 className="text-3xl font-bold text-white">
            Good Afternoon, {user?.full_name}
          </h1>

          <p className="mt-2 text-slate-400">
            Your profile is {profile?.profile_completion_score}% complete.
            Complete it to unlock AI recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;