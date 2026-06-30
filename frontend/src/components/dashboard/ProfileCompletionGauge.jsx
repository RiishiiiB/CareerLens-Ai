import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

const ProfileCompletionGauge = ({ percentage }) => {
  const getColor = () => {
    if (percentage >= 80) return "#22c55e";
    if (percentage >= 60) return "#3b82f6";
    if (percentage >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getStatus = () => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Average";
    return "Needs Improvement";
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-4 text-xl font-semibold text-white">
        Profile Completion
      </h2>

      <div className="mx-auto w-40 md:w-44 lg:w-48">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          strokeWidth={10}
          styles={buildStyles({
            pathColor: getColor(),
            textColor: "#ffffff",
            trailColor: "#1e293b",
            pathTransitionDuration: 1.5,
          })}
        />
      </div>

      <p className="mt-3 text-center text-lg font-semibold text-white">
        {getStatus()}
      </p>

      <p className="mt-1 text-center text-sm text-slate-400">
        Complete your profile to unlock all AI features.
      </p>
    </div>
  );
};

export default ProfileCompletionGauge;