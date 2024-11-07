import {
  Paper,
  Stack,
  Text,
  Title,
  Grid,
  Avatar,
  Badge,
  Group,
  Button,
} from "@mantine/core";
import { IconX, IconLoader } from "@tabler/icons-react";
import {
  createFileRoute,
  useRouterState,
  useNavigate,
} from "@tanstack/react-router";
import CodingEditor from "../../components/Collaboration/CodingEditor";
import { UserRoomCreatedData } from "@common/shared-types";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { stringToHexColor } from "../../components/Questions/QuestionsTable";
import { useCopilotChat, useCopilotReadable } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { useState } from "react";
import { leetCodePrompt } from "../../components/Copilot/prompts";
import "@copilotkit/react-ui/styles.css";
import "./collaboration.css";

export const Route = createFileRoute("/_authenticated/collaboration/$roomId")({
  component: Collaboration,
});

export function Collaboration() {
  const [code, setCode] = useState<string>("");

  useCopilotChat({ initialMessages: [] });

  // Get room data from router state
  const locationState = useRouterState({
    select: (state) => state.location.state,
  });
  const { roomId } = Route.useParams();
  const navigate = useNavigate();

  const exitRoom = () => {
    navigate({
      to: "/matching",
    });
  };

  const {
    data: userRoomData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["userRoomData", { roomId }],
    queryFn: async () => {
      try {
        return await api.roomClient.getRoom(roomId);
      } catch (error) {
        console.error(error);

        if (
          error instanceof AxiosError &&
          error.response &&
          error.response.status === 401
        ) {
          if (error.response.data === "User is not part of the room") {
            navigate({
              to: "/matching",
            });
          } else {
            navigate({
              to: "/",
            });
          }

          notifications.show({
            color: "red",
            title: "Error fetching Room",
            message: error.response.data,
          });
        }

        notifications.show({
          color: "red",
          title: "Error fetching Room",
          message: `${(error as Error).message}`,
        });
        throw error;
      }
    },
    initialData: locationState.userRoomData as UserRoomCreatedData,
  });

  const onCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  useCopilotReadable({
    description: "Question given",
    value: userRoomData?.question.title + userRoomData?.question.description,
  });

  useCopilotReadable({
    description: "Code written by user",
    value: code,
  });

  return (
    <Stack align="center">
      <CopilotPopup
        labels={{
          title: "Peerprep Sensei",
          initial: "Hi, PeerPrep Sensei here. Need any help?",
        }}
        instructions={leetCodePrompt}
        clickOutsideToClose={false}
      />

      <Title ta="center">Collaboration</Title>
      {isLoading ? (
        <Paper shadow="md" withBorder p="lg">
          <Stack align="center">
            <Avatar color="blue">
              <IconLoader />
            </Avatar>
            <Text c="black" fw="bold">
              Loading...
            </Text>
          </Stack>
        </Paper>
      ) : isSuccess ? (
        <Grid w="100%">
          <Grid.Col span={{ base: 12, xs: 8 }}>
            <Paper shadow="md" p="lg" h="80vh" withBorder>
              <CodingEditor
                isOpen={userRoomData.isOpen}
                roomId={roomId}
                onCodeChange={onCodeChange}
              />
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, xs: 4 }}>
            <Stack h="80vh" justify="space-between">
              <Paper w="auto" shadow="md" p="lg" h="75vh" withBorder>
                <Stack gap={10}>
                  <Title c="black" order={3}>
                    {userRoomData.question.title}
                  </Title>
                  <Group gap={5} align="flex-start">
                    {userRoomData.question.categories.map((category) => (
                      <Badge
                        key={category}
                        size="sm"
                        autoContrast
                        bg={stringToHexColor(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </Group>
                  <Text c="black">{userRoomData.question.description}</Text>
                </Stack>
              </Paper>

              <Button color="black" w="10vw" onClick={exitRoom}>
                Exit Room
              </Button>
            </Stack>
          </Grid.Col>
        </Grid>
      ) : isError ? (
        <Paper shadow="md" withBorder p="lg">
          <Stack align="center">
            <Avatar color="red">
              <IconX />
            </Avatar>
            <Text c="black" fw="bold">
              Error fetching room
            </Text>
          </Stack>
        </Paper>
      ) : null}
    </Stack>
  );
}
