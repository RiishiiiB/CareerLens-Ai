import api from "./api";

export const analyzeResume = async (resumeId) => {
  const response = await api.post(`/ai/analyze-resume/${resumeId}`);
  return response.data;
};

export const analyzeSkillGap = async (payload) => {
  const response = await api.post("/ai/skill-gap", payload);
  return response.data;
};