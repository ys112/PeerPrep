import axios, { InternalAxiosRequestConfig } from "axios";

export const createAuthAxiosInstance = (baseURL: string) => {
  const authAxios = axios.create({
    baseURL
  })

  authAxios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = localStorage.getItem('access_token')
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config
    }, (error) => {
      return Promise.reject(error);
    })

  return authAxios
}