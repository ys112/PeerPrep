import { SensitiveUser, User } from "@common/shared-types";
import axios from "axios";
import { tokenStorage } from "../utils/tokenStorage";
import { userStorage } from "../utils/userStorage";

// for public routes
const defaultAxios = axios.create({
  baseURL: import.meta.env.VITE_USERS_SERVICE_API_URL,
});

const USER_API_URL = "/users";
const AUTH_API_URL = "/auth";

const loginUser = async (
  user: Omit<SensitiveUser, "isAdmin" | "username" | "createdAt">
) => {
  try {
    const response = await defaultAxios.post(`${AUTH_API_URL}/login`, user);
    const { accessToken: token, ...userData } = response.data.data;
    tokenStorage.setToken(token);
    userStorage.setUser(userData);
    return userData as User;
  } catch (error) {
    console.error("Error logging in: ", error);
    throw error;
  }
};

const registerUser = async (
  user: Omit<SensitiveUser, "isAdmin" | "createdAt">
) => {
  try {
    const response = await defaultAxios.post(USER_API_URL, user);
    const { accessToken: token, ...userData } = response.data.data;
    tokenStorage.setToken(token);
    userStorage.setUser(userData);
    return userData as User;
  } catch (error) {
    console.error("Error registering: ", error);
    throw error;
  }
};

export const userClient = {
  loginUser,
  registerUser,
};
