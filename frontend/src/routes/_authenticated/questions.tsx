import { createFileRoute, redirect } from "@tanstack/react-router";
import { QuestionsPage } from "../../components/Questions/QuestionsPage";
import { userStorage } from "../../utils/userStorage";
import { notifications } from "@mantine/notifications";

export const Route = createFileRoute("/_authenticated/questions")({
  component: QuestionsPage,
});
