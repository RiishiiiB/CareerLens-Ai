import api from "./api";

export const getCertifications = async () => {
  const { data } = await api.get("/students/profile/certifications");
  return data;
};

export const addCertification = async (payload) => {
  const { data } = await api.post(
    "/students/profile/certifications",
    payload
  );
  return data;
};

export const updateCertification = async (id, payload) => {
  const { data } = await api.patch(
    `/students/profile/certifications/${id}`,
    payload
  );
  return data;
};

export const deleteCertification = async (id) => {
  await api.delete(
    `/students/profile/certifications/${id}`
  );
};