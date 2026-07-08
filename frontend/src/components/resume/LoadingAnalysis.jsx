import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

const messages = [
  "Parsing your resume...",
  "Calculating ATS score...",
  "Analyzing technical skills...",
  "Finding missing skills...",
  "Generating AI recommendations...",
  "Preparing final report...",
];

export default function LoadingAnalysis() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-3xl border border-blue-500/20 bg-slate-900 p-12 shadow-xl">

      <div className="flex flex-col items-center">

        <div className="relative">

          <Loader2
            className="h-16 w-16 animate-spin text-blue-500"
          />

          <Sparkles
            className="absolute -right-2 -top-2 text-cyan-400"
            size={20}
          />

        </div>

        <h2 className="mt-8 text-3xl font-bold text-white">
          Gemini AI is Analyzing...
        </h2>

        <p className="mt-4 h-6 text-lg text-slate-400 transition-all duration-300">
          {messages[index]}
        </p>

        <div className="mt-10 h-2 w-full max-w-md overflow-hidden rounded-full bg-slate-800">

          <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500"></div>

        </div>

      </div>

    </div>
  );
}   