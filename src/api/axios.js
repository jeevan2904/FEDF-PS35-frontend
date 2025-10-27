import axios from "axios";

const api = axios.create({
  baseURL: "https://fedf-ps35-backend-1.onrender.com/api", // backend URL
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
