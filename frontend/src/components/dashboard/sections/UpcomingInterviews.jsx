import Card from "../../ui/Card";
import { CalendarDays, CalendarPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const UpcomingInterviews = () => {
  const navigate = useNavigate();

  return (
    <Card className="h-full">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-green-500/15 p-3">
          <CalendarDays
            size={22}
            className="text-green-400"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            Upcoming Interviews
          </h2>

          <p className="text-sm text-slate-400">
            Stay prepared for your next opportunity
          </p>
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CalendarPlus
            size={30}
            className="text-green-400"
          />
        </div>

        <h3 className="text-lg font-semibold text-white">
          No Interviews Scheduled
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Once companies shortlist your profile, your interview schedule
          will appear here.
        </p>

        <button
          onClick={() => navigate("/companies")}
          className="mt-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-2.5 font-medium text-white transition hover:scale-105"
        >
          Explore Companies
        </button>
      </motion.div>
    </Card>
  );
};

export default UpcomingInterviews;