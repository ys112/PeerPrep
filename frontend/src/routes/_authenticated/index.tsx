import { Loader, Paper, Stack, Title } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import { userStorage } from '../../utils/userStorage';

export const Route = createFileRoute('/_authenticated/')({
  component: Dashboard,
});

function Dashboard() {
  const user = userStorage.getUser()!;

  return <>
    <Paper mb='md' p='md' withBorder radius='md' shadow='md'>
      <Stack ta='center'>
        <Title size='h2'>Welcome, {user.username}</Title>
      </Stack>
    </Paper>
    <Paper mb='md' p='md' withBorder radius='md' shadow='md'>
      <Stack ta='center'>
        <Loader mx='auto' color='lime' />
      </Stack>
    </Paper>
  </>;
}
