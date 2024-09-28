import axios from "axios";

export const questionApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
