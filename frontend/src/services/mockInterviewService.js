import api from "./api";

const mockInterviewService = {
  // Generate Interview Questions
  async generateInterview(data) {
    const response = await api.post("/mock-interview/generate", data);
    return response.data;
  },

  // Evaluate One Answer
  async evaluateAnswer(data) {
    const response = await api.post("/mock-interview/evaluate", data);
    return response.data;
  },

  // Generate Final Summary
  async generateSummary(data) {
    const response = await api.post("/mock-interview/summary", data);
    return response.data;
  },

  // Previous Interviews
  async getInterviews() {
    const response = await api.get("/mock-interview/");
    return response.data;
  },
};

export default mockInterviewService;