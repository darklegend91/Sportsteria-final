import axios from "axios";

// Read backend base URL from Vite env (VITE_API_URL). Keep the fallback for local dev.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8095/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
