import { useEffect, useState } from "react";
import { Sparkles, BadgeCheck, TriangleAlert, Briefcase, FileSearch, RotateCcw, Award, TrendingUp } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ResumeScoreCard from "../components/resume/ResumeScoreCard";
import AnalysisCard from "../components/resume/AnalysisCard";
import LoadingAnalysis from "../components/resume/LoadingAnalysis";
import EmptyResumeState from "../components/resume/EmptyResumeState";
import { getCurrentUser } from "../services/authService";
import { getResumes } from "../services/resumeService";
import { analyzeResume } from "../services/aiService";
import { toast } from "react-hot-toast";
export default function ResumeAnalyzer() {
  const [user,setUser]=useState(null);
  const [analysis,setAnalysis]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [hasResume,setHasResume]=useState(false);

  const loadAnalysis = async (showToast = false) => {
  try {
    setLoading(true);
    setError("");

    const currentUser = await getCurrentUser();
    setUser(currentUser);

    const resumes = await getResumes();

    if (!Array.isArray(resumes) || resumes.length === 0) {
      setHasResume(false);
      return;
    }

    setHasResume(true);

    const primary =
      resumes.find((r) => r.is_primary) || resumes[0];

    const result = await analyzeResume(primary.id);

    setAnalysis(result);
    if (showToast) {
  toast.success("Resume analyzed successfully");
}
  } catch (err) {
    console.error(err);
    setError("Failed to analyze resume.");
    toast.error("Analysis failed");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  loadAnalysis();
}, []);

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div className="flex items-start justify-between gap-4">

  <div>

    <div className="flex items-center gap-3">

      <Sparkles className="text-blue-500" size={32} />

      <h1 className="text-4xl font-bold text-white">
        AI Resume Analyzer
      </h1>

    </div>

    <p className="mt-2 text-slate-400">
      Analyze your latest uploaded resume using Gemini AI.
    </p>

  </div>

  <button
    onClick={() => loadAnalysis(true)}
    disabled={loading}
    className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
  >
    <RotateCcw size={18} />
    Analyze Again
  </button>

</div>

        {loading && <LoadingAnalysis />}
        {!loading && !hasResume && <EmptyResumeState />}
        {!loading && error && <div className="rounded-xl border border-red-600 bg-red-950 p-4 text-red-300">{error}</div>}

        {!loading && analysis && <>
          <ResumeScoreCard score={analysis.ats_score} rating={analysis.ats_rating}/>
          <div className="grid gap-6 lg:grid-cols-2">
            <AnalysisCard title="Strengths" icon={<BadgeCheck className="text-green-400"/>} items={analysis.strengths||[]} color="green"/>
            <AnalysisCard title="Weaknesses" icon={<TriangleAlert className="text-red-400"/>} items={analysis.weaknesses||[]} color="red"/>
            <AnalysisCard title="Missing Skills" icon={<FileSearch className="text-yellow-400"/>} items={analysis.missing_skills||[]} color="yellow"/>
            <AnalysisCard title="Recommended Projects" icon={<Briefcase className="text-purple-400"/>} items={analysis.recommended_projects||[]} color="purple"/>
          </div>
          <div
  className={`rounded-3xl border p-8 shadow-xl transition-all duration-300 ${
    analysis.verdict?.toLowerCase().includes("excellent")
      ? "border-green-500/30 bg-green-500/10"
      : analysis.verdict?.toLowerCase().includes("good")
      ? "border-yellow-500/30 bg-yellow-500/10"
      : "border-red-500/30 bg-red-500/10"
  }`}
>
  <div className="flex items-center gap-4">

    <div className="rounded-2xl bg-white/10 p-4">

      <Award className="text-yellow-400" size={28} />

    </div>

    <div>

      <h2 className="text-2xl font-bold text-white">
        Final Verdict
      </h2>

      <p className="text-slate-400">
        Overall AI Evaluation
      </p>

    </div>

  </div>

  <h1 className="mt-8 text-3xl font-bold text-white">
    {analysis.verdict}
  </h1>

  <div className="mt-8 flex items-start gap-4 rounded-2xl bg-black/20 p-5">

    <TrendingUp className="mt-1 text-green-400" />

    <div>

      <h3 className="font-semibold text-white">
        AI Recommendation
      </h3>

      <p className="mt-2 leading-7 text-slate-300">

        Continue improving the missing skills highlighted above and
        keep your resume updated with measurable achievements,
        internships and impactful projects to maximize your ATS score.

      </p>

    </div>

  </div>

</div>
        </>}
      </div>
    </DashboardLayout>
  );
}
