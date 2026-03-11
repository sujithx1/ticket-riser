import { getSessionId } from "@/api/auth.api";
import axios from "axios";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token =getSessionId();
  if (token) {
    // config.headers.Authorization=`Bearer ${token}`

    config.headers["app-session-id"] = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Unauthorized"
    ) {
      //  window.location.href = ;
      localStorage.removeItem("app-session-id");
      localStorage.removeItem("user");
      window.location.href = `${import.meta.env.VITE_AUTH_URL}/api/login?client_id=${import.meta.env.VITE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}`;
    }

    return Promise.reject(error);
  },
);
