import { Sparkles, Upload, Brain } from "lucide-react";

import Button from "../ui/Button";
import ProfileCompletionGauge from "./ProfileCompletionGauge";

const HeroSection = ({
  user,
  completion,
}) => {
  return (
    <div className="mb-8 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 p-8">

      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        {/* Left Side */}

        <div className="flex-1">

          <div className="flex items-center gap-3">
            <Sparkles
              className="text-blue-500"
              size={30}
            />

            <h1 className="text-4xl font-bold text-white">
              Good Afternoon, {user?.full_name}
            </h1>
          </div>

          <p className="mt-4 max-w-xl text-lg text-slate-400">
            Welcome back! Complete your profile to unlock
            personalized AI recommendations and career insights.
          </p>


          {/* Quick Actions */}

          <div className="mt-8 flex flex-wrap gap-4">

            <Button>
              <Upload size={18} />
              <span className="ml-2">
                Upload Resume
              </span>
            </Button>

            <Button variant="secondary">
              <Brain size={18} />
              <span className="ml-2">
                Analyze Resume
              </span>
            </Button>

          </div>

        </div>

        {/* Right Side */}

        <div className="flex justify-center lg:justify-end">

          <div className="w-48">
            <ProfileCompletionGauge
              percentage={completion}
            />
          </div>

        </div>

      </div>

    </div>
  );
};

export default HeroSection;