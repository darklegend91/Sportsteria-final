import axios from "axios";

// Read backend base URL from Vite env (VITE_API_URL). Keep the fallback for local dev.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8095/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");

  // Don't attach Authorization header for auth endpoints (supports both /auth and /api/auth)
  // Handles both relative URLs (e.g. "/auth/signup") and absolute URLs.
  const url = cfg.url || "";
  let path = url;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try { path = new URL(url).pathname; } catch (e) { /* leave as-is */ }
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (token && !normalizedPath.startsWith("/auth") && !normalizedPath.startsWith("/api/auth")) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

export default api;
