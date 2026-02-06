import axios from "axios";

// Determine BASE_URL based on environment
let BASE_URL;

// Try to get from environment variable first (set via .env or CI/CD)
if (import.meta.env.VITE_API_URL) {
  BASE_URL = import.meta.env.VITE_API_URL;
} else if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Local development fallback
  BASE_URL = "http://localhost:8080";
} else {
  // Production fallback - default to known production backend
  BASE_URL = "https://sportsteria-final.onrender.com";
}


// Debug: Log the base URL being used
console.log("API Base URL:", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");

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
