import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
  baseURL: "http://10.5.51.59:8008/api/v1/",
  // baseURL: "https://api.tracklone.io/api/v1/",
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (request) => {
    const accessToken =
      Cookies.get("authToken");

    if (accessToken) {
      request.headers[
        "Authorization"
      ] = `Bearer ${accessToken}`;
    }

    if (request.data instanceof FormData) {
      delete request.headers[
        "Content-Type"
      ];
    } else {
      request.headers[
        "Content-Type"
      ] = "application/json";
    }

    return request;
  },

  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error?.response?.status === 401 &&
      !originalRequest?.sent
    ) {
      Cookies.remove("authToken");

      localStorage.removeItem(
        "selectedSite"
      );

      Cookies.remove("_id");
      Cookies.remove("role");

      window.location.href =
        "/auth/signin";

      originalRequest.sent = true;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;