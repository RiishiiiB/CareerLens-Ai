const statusStyles = {
  Applied:
    "bg-orange-500/15 text-orange-400 border border-orange-500/30",

  "Online Assessment":
    "bg-blue-500/15 text-blue-400 border border-blue-500/30",

  Interview:
    "bg-purple-500/15 text-purple-400 border border-purple-500/30",

  Offer:
    "bg-green-500/15 text-green-400 border border-green-500/30",

  Rejected:
    "bg-red-500/15 text-red-400 border border-red-500/30",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        statusStyles[status] ||
        "bg-gray-700 text-gray-300 border border-gray-600"
      }`}
    >
      {status}
    </span>
  );
}