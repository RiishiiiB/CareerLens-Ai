export default function RoadmapTimeline() {
  const roadmap = [
    {
      phase: "Month 1",
      title: "Build the Foundation",
      tasks: [
        "Master Python",
        "Learn FastAPI",
        "Practice SQL",
        "Build CRUD APIs",
      ],
    },
    {
      phase: "Month 2",
      title: "Backend Development",
      tasks: [
        "Authentication with JWT",
        "Docker",
        "Redis",
        "Deploy a Project",
      ],
    },
    {
      phase: "Month 3",
      title: "Industry Preparation",
      tasks: [
        "AWS Basics",
        "System Design Basics",
        "Interview Preparation",
        "Resume Improvements",
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {roadmap.map((item) => (
        <div
          key={item.phase}
          className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {item.phase}
            </h2>

            <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white">
              {item.title}
            </span>
          </div>

          <ul className="space-y-3">
            {item.tasks.map((task) => (
              <li
                key={task}
                className="rounded-xl bg-slate-800 px-4 py-3 text-slate-300"
              >
                {task}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}