// src/api.js
import axios from "axios";

// dev default: http://localhost:5000 ; prod: set REACT_APP_API_BASE_URL
const normalize = (u) =>
  (u || "http://localhost:5000").trim().replace(/\/+$/, "");
export const API_BASE_URL = normalize(process.env.REACT_APP_API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  // keep headers empty so GETs remain "simple" (no preflight)
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Only set JSON content-type when sending a body AND it's not FormData
  const hasBody = typeof config.data !== "undefined";
  const isFormData = hasBody && config.data instanceof FormData;
  if (hasBody && !isFormData && !config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

// Optional: normalize error messages in one place
api.interceptors.response.use(
  (res) => res,
  (err) => {
    err.normalizedMessage =
      err?.response?.data?.error || err?.message || "Network error";
    return Promise.reject(err);
  }
);

// -------- Helpers you can import everywhere --------

export const joinUrl = (base, path) => {
  const b = String(base || "").replace(/\/+$/, "");
  const p = String(path || "");
  if (!p) return "";
  return `${b}${p.startsWith("/") ? "" : "/"}${p}`;
};

// Build image URLs correctly in dev/prod.
// - Leaves /assets/* to be served by the React dev server (3000)
// - Prefixes known backend paths (/uploads, /media, etc.) with API_BASE_URL
export const toImageUrl = (val) => {
  const p = (val || "").trim();
  if (!p) return "/assets/profile-profile-placeholder.jpg";
  if (/^https?:\/\//i.test(p)) return p;
  if (p.startsWith("/assets") || p.startsWith("assets/")) return p; // frontend public
  if (
    p.startsWith("/uploads") ||
    p.startsWith("uploads/") ||
    p.startsWith("/media") ||
    p.startsWith("media/") ||
    p.startsWith("/static/uploads")
  ) {
    return joinUrl(API_BASE_URL, p);
  }
  // default: treat as backend path
  return joinUrl(API_BASE_URL, p);
};
