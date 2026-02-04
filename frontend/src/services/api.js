import axios from "axios";

// Read backend base URL from Vite env variable (VITE_API_URL)
// - Local: Set in .env file
// - Production: Set in .env.production or CI/CD environment
// Fallback for local dev: http://localhost:8095/api
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8095/api";

// Debug: Log the base URL being used (can be removed in production)
console.log("API Base URL:", BASE_URL);

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
