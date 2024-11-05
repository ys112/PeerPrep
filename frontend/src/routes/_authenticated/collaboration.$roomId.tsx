import { Paper, Stack, Text, Title } from "@mantine/core";
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

  const {
    data: userRoomData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["userRoomData"],
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
    <Paper shadow="md" p="lg" h="90vh" withBorder>
      <Title ta="center">Collaboration</Title>
      <Stack h="90%">
        {isLoading ? (
          <Text>"Loading..."</Text>
        ) : isSuccess ? (
          <CodingEditor isOpen={userRoomData.isOpen} roomId={roomId} />
        ) : null}

        {isError ? <Text c="red">"Error fetching room"</Text> : null}
      </Stack>
    </Paper>
  );
}
