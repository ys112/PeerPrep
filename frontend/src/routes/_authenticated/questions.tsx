import { createFileRoute, redirect } from "@tanstack/react-router";
import { QuestionsPage } from "../../components/Questions/QuestionsPage";
import { userStorage } from "../../utils/userStorage";
import { notifications } from "@mantine/notifications";

export const Route = createFileRoute("/_authenticated/questions")({
  component: QuestionsPage,
  beforeLoad: () => {
    const user = userStorage.getUser();
    if (!user) {
      throw redirect({ to: "/login", throw: true });
    } else if (!user?.isAdmin) {
      notifications.show({
        title: "Unauthorized",
        message: "You are not authorized to view this page",
        color: "red",
      });
      throw redirect({ to: "/", throw: true });
    }
  },
});
