import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "../components/Users/LoginPage";
import { tokenStorage } from "../utils/tokenStorage";
import { userStorage } from "../utils/userStorage";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  beforeLoad: () => {
    tokenStorage.removeToken();
    userStorage.removeUser();
  },
});
