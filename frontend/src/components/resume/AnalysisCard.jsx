const colorClasses = {
  green: {
    border: "border-green-500/30",
    bg: "bg-green-500/10",
    dot: "bg-green-400",
  },
  red: {
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    dot: "bg-red-400",
  },
  yellow: {
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/10",
    dot: "bg-yellow-400",
  },
  purple: {
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    dot: "bg-purple-400",
  },
  blue: {
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    dot: "bg-blue-400",
  },
};

export default function AnalysisCard({
  title,
  icon,
  items = [],
  color = "blue",
}) {
  const theme = colorClasses[color] || colorClasses.blue;

  return (
    <div
      className={`rounded-2xl border ${theme.border} bg-slate-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
    >
      <div className="mb-6 flex items-center gap-3">
        <div className={`rounded-xl p-3 ${theme.bg}`}>
          {icon}
        </div>

        <h2 className="text-xl font-semibold text-white">
          {title}
        </h2>
      </div>

      {items.length === 0 ? (
        <p className="text-slate-500 italic">
          Nothing to display.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-slate-300"
            >
              <span
                className={`mt-2 h-2.5 w-2.5 rounded-full ${theme.dot}`}
              ></span>

              <span className="leading-7">
                {item}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}