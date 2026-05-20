/**
 * Shared Axios instance for all API calls.
 * - Attaches JWT from localStorage as Authorization: Bearer <token>
 * - withCredentials: true to also send cookies (works on localhost)
 * This dual approach ensures auth works both locally AND on Vercel (cross-domain).
 */
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,  // send cookies (works on localhost & same-domain)
});

// Attach Bearer token from localStorage for cross-domain Vercel auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
