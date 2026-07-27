import { useState } from "react";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import RoadmapTimeline from "../components/roadmap/RoadmapTimeline";
import { generateCareerRoadmap } from "../services/aiService";

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "AI Engineer",
  "Data Engineer",
  "DevOps Engineer",
];

export default function CareerRoadmap() {
  const [role, setRole] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!role) {
      toast.error("Please select a target role");
      return;
    }

    try {
      setLoading(true);

      const data = await generateCareerRoadmap(role);

      setRoadmap(data);

      toast.success("Career roadmap generated successfully");
    } catch (error) {
  console.error(error);

  if (error.response?.status === 429) {
    toast.error("⚠️ AI quota exceeded. Please try again later.");
  } else {
    toast.error(
      error.response?.data?.detail ||
      "Failed to generate roadmap."
    );
  }
}
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Career Roadmap
          </h1>

          <p className="mt-2 text-slate-400">
            Generate a personalized AI roadmap to reach your dream career.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <label className="mb-3 block text-sm font-medium text-slate-300">
            Target Role
          </label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none"
          >
            <option value="">Select Target Role</option>

            {roles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Roadmap"}
          </button>
        </div>

        {roadmap && <RoadmapTimeline roadmap={roadmap} />}
      </div>
    </DashboardLayout>
  );
}