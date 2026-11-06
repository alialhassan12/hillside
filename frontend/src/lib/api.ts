import axios from "axios";
import { clearSession, getToken } from "./auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

function isAdminPage() {
  return window.location.pathname.startsWith("/admin");
}

// Send the admin token only from admin pages, so public visitors' requests
// never carry it. The login request itself never needs it.
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token && isAdminPage() && config.url !== "/login") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// An expired or revoked token answers 401: clear it and go to the login
// page, remembering where the admin was.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const sentToken = Boolean(error.config?.headers?.Authorization);
    const isAuthCall =
      error.config?.url === "/login" || error.config?.url === "/logout";

    if (error.response?.status === 401 && sentToken && !isAuthCall) {
      clearSession();
      const redirect = encodeURIComponent(
        window.location.pathname + window.location.search,
      );
      window.location.replace(`/admin/login?expired=1&redirect=${redirect}`);
    }

    return Promise.reject(error);
  },
);
