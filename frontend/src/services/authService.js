import api from "./api";

export const signup = (payload) => api.post("/auth/signup", payload);
export const login = (payload) => api.post("/auth/login", payload);
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
