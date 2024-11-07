import { Divider, Loader, Paper, Stack, Title } from "@mantine/core";
import { userStorage } from "../../utils/userStorage";

export function Dashboard() {
  const user = userStorage.getUser()!;

  return <>
    <Paper mb='md' p='md' withBorder radius='md' shadow='md'>
      <Stack ta='center'>
        <Title order={2}>Welcome, {user.username}</Title>
        <Divider my="md" />
        <Title order={3}>Question History</Title>
        <Loader mx='auto' color='lime' />
      </Stack>
    </Paper>
  </>;
}
