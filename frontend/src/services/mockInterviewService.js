import api from "./api";

const mockInterviewService = {
  async generateInterview(data) {
    const response = await api.post("/mock-interview/generate", data);
    return response.data;
  },

  async getInterviews() {
    const response = await api.get("/mock-interview/");
    return response.data;
  },
};

export default mockInterviewService;