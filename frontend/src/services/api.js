import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8095/api",
  timeout: 10000
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
