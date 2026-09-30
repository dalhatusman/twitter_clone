import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api"}) ;

api.interceptors.request.use((config) => {
        const token = sessionStorage.getItem("access_token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Never try to refresh on the login/token endpoint itself
    if (originalRequest.url?.includes("/token/") && !originalRequest.url?.includes("/token/refresh/")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem("refresh_token");

        if (!refreshToken) {
          return Promise.reject(error); 
        }

        const { data } = await axios.post("http://localhost:8000/api/token/refresh/", {
          refresh: refreshToken,
        });

        sessionStorage.setItem("access_token", data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;

        return api(originalRequest);
      } catch (refreshError) {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError); 
      }
    }

    return Promise.reject(error);
  }
);

export default api;


