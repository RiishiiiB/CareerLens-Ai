import api from "./api";

const authService = {
  async register(data) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  async login(email, password) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { access_token, refresh_token } =
      response.data.tokens;

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);

    return response.data.user;
  },

  async logout() {
    const refresh_token =
      localStorage.getItem("refresh_token");

    if (refresh_token) {
      try {
        await api.post("/auth/logout", {
          refresh_token,
        });
      } catch (error) {
        console.error(error);
      }
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  async getCurrentUser() {
    const response = await api.get("/users/me");
    return response.data;
  },

  isAuthenticated() {
    return !!localStorage.getItem("access_token");
  },
};

export const getCurrentUser =
  authService.getCurrentUser;

export default authService;