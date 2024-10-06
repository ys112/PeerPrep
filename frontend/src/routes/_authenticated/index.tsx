import { Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { userStorage } from "../../utils/userStorage";

export const Route = createFileRoute("/_authenticated/")({
  component: Component,
});

function Component() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => userStorage.getUser(),
  });

  return (
    <Stack>
      <Text fs="italic" fw="bold" ta="center">
        Welcome to PeerPrep{user?.username ? ", " + user.username : ""}!
      </Text>
    </Stack>
  );
}
