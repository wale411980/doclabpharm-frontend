import axios from "axios";
import {
  convertKeysToCamelCase,
  convertKeysToSnakeCase,
} from "@/utils/caseConverter";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Automatically attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      /* DOCLAB_AUTH_CLEAR_FIX_V1 - redirected but left the token in localStorage,
         so Navbar.tsx kept rendering the Dashboard button, which then hit
         ProtectedRoute and bounced to /unauthorized. */
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

// 🔁 Convert request data to snake_case
api.interceptors.request.use((config) => {
  // Check if it's the register endpoint
  if (config.url && config.url.includes("/register")) {
    // Skip snake_case conversion for register
    return config;
  }

  if (config.url && config.url.includes("/caregiver/register")) {
    // Skip snake_case conversion for register
    return config;
  }

  const isUpdatePharmacyById =
    config.method?.toLowerCase() === "put" &&
    /^\/pharmacy\/\w+/.test(config.url || "");

  if (isUpdatePharmacyById) {
    // Skip snake_case conversion for updatePharmacyProfile by ID
    return config;
  }

  const isUpdateLabTechnicianById =
    config.method?.toLowerCase() === "put" &&
    /^\/lab-technician\/\w+/.test(config.url || "");

  if (isUpdateLabTechnicianById) {
    // Skip snake_case conversion for updateLabTechnicianProfile by ID
    return config;
  }

  if (config.data instanceof FormData) {
    return config;
  }

  if (config.data) {
    config.data = convertKeysToSnakeCase(config.data);
  }
  if (config.params) {
    config.params = convertKeysToSnakeCase(config.params);
  }
  return config;
});

// 🔁 Convert response data to camelCase
api.interceptors.response.use(
  (response) => {
    // ✅ Skip camelCase conversion for blob responses (e.g., audio/video)
    if (
      response.config.responseType === "blob" ||
      response.request?.responseType === "blob"
    ) {
      return response;
    }

    if (response.data) {
      response.data = convertKeysToCamelCase(response.data);
    }

    return response;
  },
  (error) => {
    if (error.response && error.response.data) {
      error.response.data = convertKeysToCamelCase(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
