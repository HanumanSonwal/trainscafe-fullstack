import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    const data = response.data;

    if (data?.success && data?.message && response.config.method !== "get") {
      toast.success(data.message);
    }

    return response;
  },

  async (error) => {

    const originalRequest = error.config;

    // ❗ skip refresh for /auth/me
    if (originalRequest.url?.includes("/auth/me")) {
      window.location.replace("/login");
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      try {

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        return api(originalRequest);

      } catch {

        window.location.replace("/login");

      }

    }

    return Promise.reject(error);

  }
);

export default api;
