import { matchFormSchema, MatchFormValue } from "@common/shared-types";
import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Paper,
  Select,
  Stack,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchQuestions } from "../../queries/questionQueries";
import MatchingTimer from "./MatchingTimer";
import socket from "../../socket/match-socket";
import { userStorage } from "../../utils/userStorage";
import { io, Socket } from "socket.io-client";

export function MatchingForm() {
  const user = userStorage.getUser()!;
  type Complexity = "Easy" | "Medium" | "Hard";

  const [isMatching, setIsMatching] = useState(false);

  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
    initialData: [],
  });

  const form = useForm({
    initialValues: {
      complexity: "" as Complexity,
      category: "",
    },
    validate: zodResolver(matchFormSchema),
  });
  // const socket: Socket = io("ws://localhost:3003");

  const complexities = ["Easy", "Medium", "Hard"].filter((c) =>
    questions?.some((q) => q.complexity === c)
  );

  const match = (values: MatchFormValue) => {
    setIsMatching(!isMatching);

    socket.emit("MATCH_REQUEST", {
      userId: 1, // Use proper user ID
      difficulty: values.complexity,
      topic: values.category,
    });
    // Check if socket is connected before emitting
    if (socket.connected) {
      console.log("Socket is connected!");
      socket.emit("MATCH_REQUEST", {
        userId: 1, // Use proper user ID
        difficulty: values.complexity,
        topic: values.category,
      });
    } else {
      console.log("Socket is not connected!");
      notifications.show({
        title: "Error",
        message: "Could not connect to match server",
        color: "red",
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit((values) => match(values))}>
      <Box pos="relative">
        <LoadingOverlay visible={isLoading} />
        <Paper withBorder shadow="md" radius="md" w={600} p={30} mt={30}>
          {/* Initial state of selection */}
          {!isMatching && (
            <Stack>
              <Group w="100%" justify="space-between" grow>
                <Select
                  label="Difficulty"
                  placeholder="Select difficulty"
                  required
                  data={complexities}
                  {...form.getInputProps("complexity")}
                />

                <Select
                  label="Category"
                  placeholder="Select category"
                  required
                  data={Array.from(
                    new Set(questions?.map((q) => q.categories).flat())
                  ).sort()}
                  {...form.getInputProps("category")}
                />
              </Group>
              <Button type="submit"> Match </Button>
            </Stack>
          )}

          {/* Matching state */}
          {isMatching && (
            <MatchingTimer
              time={30}
              isMatching={isMatching}
              onTimeout={() => {
                setIsMatching(false);
                notifications.show({
                  title: "Match timeout",
                  message: "No match found",
                  color: "red",
                });
              }}
            />
          )}
        </Paper>
      </Box>
    </form>
  );
}
