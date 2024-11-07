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
  Menu,
} from "@mantine/core";
import { IconX, IconLoader } from "@tabler/icons-react";
import {
  createFileRoute,
  useRouterState,
  useNavigate,
} from "@tanstack/react-router";
import CodingEditor from "../../components/Collaboration/CodingEditor";
import LanguageSelection from "../../components/Collaboration/LanguageSelection";
import { UserRoomCreatedData } from "@common/shared-types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { stringToHexColor } from "../../components/Questions/QuestionsTable";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/collaboration/$roomId")({
  component: Collaboration,
});

export function Collaboration() {
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

  return (
    <Stack align="center">
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
            <CodingEditor isOpen={userRoomData.isOpen} roomId={roomId} />
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
