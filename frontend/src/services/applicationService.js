import api from "./api";

const applicationService = {
  async getApplications() {
    const response = await api.get("/applications/");
    return response.data;
  },

  async getApplication(id) {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  async createApplication(applicationData) {
    const response = await api.post(
      "/applications/",
      applicationData
    );

    return response.data;
  },

  async updateApplication(id, applicationData) {
    const response = await api.put(
      `/applications/${id}`,
      applicationData
    );

    return response.data;
  },

  async deleteApplication(id) {
    const response = await api.delete(
      `/applications/${id}`
    );

    return response.data;
  },
};

export default applicationService;