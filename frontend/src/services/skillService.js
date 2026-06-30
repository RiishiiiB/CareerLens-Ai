import api from "./api";

export const getSkills = async () => {
  const { data } = await api.get("/students/profile/skills");
  return data;
};

export const addSkill = async (payload) => {
  const { data } = await api.post(
    "/students/profile/skills",
    payload
  );
  return data;
};

export const updateSkill = async (id, payload) => {
  const { data } = await api.patch(
    `/students/profile/skills/${id}`,
    payload
  );
  return data;
};

export const deleteSkill = async (id) => {
  const { data } = await api.delete(`/students/profile/skills/${id}`);
  return data;
};