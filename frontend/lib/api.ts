import axios from 'axios';

// Get API URL from environment variable or use production default
// In production (Netlify), this should be set to your Render backend URL
const getApiUrl = () => {
  // Check if we're in browser and have the env var
  if (typeof window !== 'undefined') {
    // Runtime check: if we're on Netlify domain, use Render backend
    if (window.location.hostname.includes('netlify.app')) {
      return 'https://dreamnex-wuiz.onrender.com/api';
    }
  }
  // Use env var if set (for build time), otherwise fallback
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

