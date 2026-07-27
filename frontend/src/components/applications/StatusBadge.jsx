const statusStyles = {
  Applied: {
    badge:
      "bg-blue-500/10 text-blue-400 border border-blue-500/30",
    dot: "bg-blue-400",
  },

  "Online Assessment": {
    badge:
      "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
    dot: "bg-yellow-400",
  },

  Shortlisted: {
    badge:
      "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
    dot: "bg-cyan-400",
  },

  Interview: {
    badge:
      "bg-purple-500/10 text-purple-400 border border-purple-500/30",
    dot: "bg-purple-400",
  },

  "HR Interview": {
    badge:
      "bg-pink-500/10 text-pink-400 border border-pink-500/30",
    dot: "bg-pink-400",
  },

  Offer: {
    badge:
      "bg-green-500/10 text-green-400 border border-green-500/30",
    dot: "bg-green-400",
  },

  Rejected: {
    badge:
      "bg-red-500/10 text-red-400 border border-red-500/30",
    dot: "bg-red-400",
  },

  Withdrawn: {
    badge:
      "bg-slate-500/10 text-slate-400 border border-slate-500/30",
    dot: "bg-slate-400",
  },
};

export default function StatusBadge({ status }) {
  const style =
    statusStyles[status] || {
      badge:
        "bg-slate-700/30 text-slate-300 border border-slate-600",
      dot: "bg-slate-400",
    };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${style.badge}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${style.dot}`}
      />

      {status}
    </span>
  );
}