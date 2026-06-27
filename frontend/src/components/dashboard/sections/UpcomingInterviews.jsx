import Card from "../../ui/Card";
import { CalendarDays } from "lucide-react";

const UpcomingInterviews = () => {
  return (
    <Card className="h-full">
      <div className="mb-5 flex items-center gap-2">
        <CalendarDays className="text-green-500" size={22} />
        <h2 className="text-xl font-semibold text-white">
          Upcoming Interviews
        </h2>
      </div>

      <div className="rounded-lg border border-dashed border-slate-700 p-8 text-center">
        <p className="text-slate-400">
          No interviews scheduled.
        </p>
      </div>
    </Card>
  );
};

export default UpcomingInterviews;