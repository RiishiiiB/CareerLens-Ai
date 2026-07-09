export default function RoadmapTimeline({ roadmap }) {
  if (!roadmap) return null;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-blue-600 bg-slate-900 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">
              {roadmap.role}
            </h2>

            <p className="text-slate-400">
              AI Generated Career Roadmap
            </p>
          </div>

          <div className="rounded-full bg-blue-600 px-5 py-2 text-white font-semibold">
            {roadmap.duration}
          </div>
        </div>
      </div>

      {roadmap.months.map((month) => (
        <div
          key={month.month}
          className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
        >
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold text-white">
              {month.month}
            </h2>

            <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white">
              {month.focus}
            </span>
          </div>

          <ul className="space-y-3">
            {month.tasks.map((task) => (
              <li
                key={task}
                className="rounded-xl bg-slate-800 px-4 py-3 text-slate-300"
              >
                • {task}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="rounded-2xl border border-green-500/30 bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-bold text-green-400">
          AI Summary
        </h2>

        <p className="leading-8 text-slate-300">
          {roadmap.summary}
        </p>
      </div>
    </div>
  );
}