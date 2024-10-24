import { Paper, Stack, Text, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import CodingEditor from "../../components/Collaboration/CodingEditor";

export const Route = createFileRoute("/_authenticated/collaboration")({
  component: Collaboration,
});

export function Collaboration() {
  return (
    <Paper shadow="md" p="lg" h="90vh" withBorder>
      <Title ta="center">Collaboration</Title>
      <Stack h="90%">
        {/* TODO: How to terminate and leave the session? */}
        <CodingEditor />
      </Stack>
    </Paper>
  );
}
