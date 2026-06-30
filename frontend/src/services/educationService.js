import api from "./api";

export const getEducation = async () => {
  const { data } = await api.get("/students/profile/education");
  return data;
};

export const addEducation = async (payload) => {
  const { data } = await api.post(
    "/students/profile/education",
    payload
  );
  return data;
};

export const updateEducation = async (id, payload) => {
  const { data } = await api.patch(
    `/students/profile/education/${id}`,
    payload
  );
  return data;
};

export const deleteEducation = async (id) => {
  await api.delete(`/students/profile/education/${id}`);
};