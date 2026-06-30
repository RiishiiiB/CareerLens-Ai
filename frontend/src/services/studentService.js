import api from "./api";

export const getStudentProfile = async () => {
  const response = await api.get("/students/profile");
  return response.data;
};

export const createStudentProfile = async (profileData) => {
  const response = await api.post("/students/profile", profileData);
  return response.data;
};

export const updateStudentProfile = async (profileData) => {
  const response = await api.patch("/students/profile", profileData);
  return response.data;
};

export const deleteStudentProfile = async () => {
  const response = await api.delete("/students/profile");
  return response.data;
};