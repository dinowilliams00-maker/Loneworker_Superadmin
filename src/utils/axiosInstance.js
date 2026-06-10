import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL || "http://10.5.50.240:8008/api/v1/",
  timeout: 15000,
  // withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken") || localStorage.getItem("authToken");

    // ✅ Force add the super token
    config.headers = {
      ...config.headers,
      "x-super-token": "lone_worker_psiBorg_Technology_2025",
    };
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("🔑 x-super-token:", config.headers["x-super-token"]);

    return config;
  },
  (error) => {
    console.error("Interceptor Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;