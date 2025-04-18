import axios from "axios";
import { useAuthStore } from "../store/auth";

const baseURL = "http://localhost:8000/";
const authApi = axios.create({
  baseURL,
  withCredentials: true,
});

authApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.set('Authorization', `Token ${token}`);
  }
  return config;
});

export default authApi;