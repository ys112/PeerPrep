import { Stack, Text } from "@mantine/core";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Component,
  // To meet D2 requirement, user is redirected to /questions as landing page
  loader: () => {
    redirect({ to: "/questions", throw: true });
  },
});

function Component() {
  return (
    <Stack>
      <Text fs="italic" fw="bold" ta="center">
        Dashboard UI here
      </Text>
    </Stack>
  );
}
