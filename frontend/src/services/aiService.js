import api from "./api";

export const analyzeResume = async (resumeId) => {
  const response = await api.post(`/ai/analyze-resume/${resumeId}`);
  return response.data;
};

export const analyzeSkillGap = async (payload) => {
  const response = await api.post("/ai/skill-gap", payload);
  return response.data;
};

export const generateCareerRoadmap = async (role) => {
  const response = await api.post(
    `/ai/career-roadmap/${encodeURIComponent(role)}`
  );

  return response.data;
};

export const generateCompanyRecommendations = async (role) => {
  const response = await api.post(
    `/ai/company-recommendations/${encodeURIComponent(role)}`
  );

  return response.data;
};