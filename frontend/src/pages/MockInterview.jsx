import { useState } from "react";
import { toast } from "react-hot-toast";

import DashboardLayout from "../components/layout/DashboardLayout";
import InterviewQuestion from "../components/mockInterview/InterviewQuestion";
import FeedbackCard from "../components/mockInterview/FeedbackCard";
import InterviewSummary from "../components/mockInterview/InterviewSummary";
import LoadingInterview from "../components/mockInterview/LoadingInterview";

import mockInterviewService from "../services/mockInterviewService";

export default function MockInterview() {
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [questionCount, setQuestionCount] = useState(5);

  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [summary, setSummary] = useState(null);

  const [answers, setAnswers] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [evaluations, setEvaluations] = useState([]);

  const generateInterview = async () => {
    if (!role.trim()) {
      toast.error("Please enter a job role.");
      return;
    }

    try {
      setLoading(true);

      const response =
        await mockInterviewService.generateInterview({
          role,
          difficulty,
          question_count: Number(questionCount),
        });

      const generatedQuestions =
        response.questions || [];

      setQuestions(generatedQuestions);
      setStarted(true);
      setCompleted(false);

      setCurrentQuestion(0);

      setAnswer("");
      setFeedback(null);
      setSummary(null);

      setAnswers([]);
      setEvaluations([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate interview.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;

    try {
      setLoading(true);

      const current =
        questions[currentQuestion];

      const result =
        await mockInterviewService.evaluateAnswer({
          question: current.question,
          answer,
          role,
        });

      setFeedback(result);

      setAnswers((prev) => [
        ...prev,
        {
          question: current.question,
          answer,
        },
      ]);

      setEvaluations((prev) => [
        ...prev,
        result,
      ]);
    } catch (err) {
      console.error(err);
      toast.error("Evaluation failed.");
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = async () => {
    const isLast =
      currentQuestion === questions.length - 1;

    if (!isLast) {
      setCurrentQuestion((prev) => prev + 1);
      setAnswer("");
      setFeedback(null);
      return;
    }

    try {
      setLoading(true);

      const result =
        await mockInterviewService.generateSummary({
          role,
          difficulty,
           questions: questions.map((q) => q.question),
           answers: answers.map((a) => a.answer),
        });

      setSummary(result);
      setCompleted(true);
      setFeedback(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate summary.");
    } finally {
      setLoading(false);
    }
  };

  const restartInterview = () => {
    setStarted(false);
    setCompleted(false);

    setQuestions([]);
    setCurrentQuestion(0);

    setAnswer("");
    setFeedback(null);
    setSummary(null);

    setAnswers([]);
    setEvaluations([]);

    setRole("");
    setDifficulty("Intermediate");
    setQuestionCount(5);
  };

  const downloadReport = () => {
    toast.success(
      "PDF export will be added in the next sprint."
    );
  };
    return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl p-8">
        {!started && (
          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl">
            <h1 className="mb-8 text-4xl font-bold text-white">
              AI Mock Interview
            </h1>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Job Role
                </label>

                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Frontend Developer"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Difficulty
                  </label>

                  <select
                    value={difficulty}
                    onChange={(e) =>
                      setDifficulty(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Questions
                  </label>

                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={questionCount}
                    onChange={(e) =>
                      setQuestionCount(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                  />
                </div>
              </div>

              <button
                onClick={generateInterview}
                className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-500"
              >
                Generate Interview
              </button>
            </div>
          </div>
        )}

        {loading && !started && <LoadingInterview />}

        {started && !completed && (
          <>
            <InterviewQuestion
              questionNumber={currentQuestion + 1}
              totalQuestions={questions.length}
              question={questions[currentQuestion]?.question}
              answer={answer}
              setAnswer={setAnswer}
              onSubmit={submitAnswer}
              loading={loading}
            />

            <div className="mt-8">
              <FeedbackCard
                feedback={feedback}
                onNext={nextQuestion}
                isLastQuestion={
                  currentQuestion === questions.length - 1
                }
              />
            </div>
          </>
        )}

        {completed && (
          <InterviewSummary
            summary={summary}
            onRestart={restartInterview}
            onDownload={downloadReport}
          />
        )}
      </div>
    </DashboardLayout>
  );
}