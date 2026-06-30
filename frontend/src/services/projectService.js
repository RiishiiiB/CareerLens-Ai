import api from "./api";

export const getProjects = async () => {
  const { data } = await api.get("/students/profile/projects");
  return data;
};

export const addProject = async (payload) => {
  const { data } = await api.post(
    "/students/profile/projects",
    payload
  );
  return data;
};

export const updateProject = async (id, payload) => {
  const { data } = await api.patch(
    `/students/profile/projects/${id}`,
    payload
  );
  return data;
};

export const deleteProject = async (id) => {
  await api.delete(`/students/profile/projects/${id}`);
};