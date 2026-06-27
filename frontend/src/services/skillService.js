import api from "./api";

export const getSkills = async () => {
  const response = await api.get("/students/profile/skills");
  return response.data;
};

export const addSkill = async (skill) => {
  const response = await api.post("/students/profile/skills", skill);
  return response.data;
};

export const updateSkill = async (id, skill) => {
  const response = await api.patch(`/students/profile/skills/${id}`, skill);
  return response.data;
};

export const deleteSkill = async (id) => {
  const response = await api.delete(`/students/profile/skills/${id}`);
  return response.data;
};