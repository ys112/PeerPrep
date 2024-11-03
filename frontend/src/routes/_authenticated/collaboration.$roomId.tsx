import { Paper, Stack, Text, Title } from "@mantine/core";
import {
  createFileRoute,
  useParams,
  useRouterState,
} from "@tanstack/react-router";
import CodingEditor from "../../components/Collaboration/CodingEditor";
import { UserRoomCreatedData } from "@common/shared-types";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";

export const Route = createFileRoute("/_authenticated/collaboration/$roomId")({
  component: Collaboration,
});

export function Collaboration() {
  // Get room data from router state
  const locationState = useRouterState({
    select: (state) => state.location.state,
  });

  const { roomId } = Route.useParams();
  const { data: userRoomData, isLoading } = useQuery({
    queryKey: ["userRoomData"],
    queryFn: () => api.roomClient.getRoom(roomId),
    initialData: locationState.userRoomData as UserRoomCreatedData,
  });

  return (
    <Paper shadow="md" p="lg" h="90vh" withBorder>
      <Title ta="center">Collaboration</Title>
      <Stack h="90%">
        <CodingEditor isOpen={userRoomData.isOpen} roomId={roomId} />
      </Stack>
    </Paper>
  );
}
