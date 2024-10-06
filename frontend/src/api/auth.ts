import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { tokenStorage } from "../utils/tokenStorage";
import { userStorage } from "../utils/userStorage";

const createAuthAxiosInstance = (baseURL: string) => {
  const authAxios = axios.create({
    baseURL: baseURL,
  });

  authAxios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (
        config.headers == undefined ||
        config.headers.Authorization == undefined
      ) {
        const token = tokenStorage.getToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  authAxios.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        tokenStorage.removeToken();
        userStorage.removeUser();
        window.location.href = "/login";
      }
      if (error.response?.status === 403) {
        window.location.href = "/";
      }
      return Promise.reject(error);
    }
  );

  return authAxios;
};

export default createAuthAxiosInstance;
