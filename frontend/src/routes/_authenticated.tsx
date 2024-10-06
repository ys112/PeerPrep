import { AppShell, Burger, Button, Group, NavLink, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconDashboard,
  IconLogout,
  IconQuestionMark,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouter,
} from '@tanstack/react-router';
import { tokenStorage } from '../utils/tokenStorage';
import { userStorage } from '../utils/userStorage';
import { api } from '../api';

export const Route = createFileRoute('/_authenticated')({
  component: Auth,
  loader: async () => {
    try {
      const response = await api.userClient.verifyToken();
      console.log(response);
    } catch (error) {
      throw redirect({ to: '/login' });
    }
  },
});

function Auth() {
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => userStorage.getUser(),
  });

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm' }}
      padding='md'
    >
      <AppShell.Header>
        <Group h='100%' px='md' justify='space-between'>
          <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
          {/* Change this to logo when we have one */}
          <Text fw='bold'>PeerPrep</Text>
          {user?.username && (
            <Text fw='bold' fs='italic'>
              Hi, {user?.username}
            </Text>
          )}
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p='md'>
        <AppShell.Section>
          <NavLink
            label='Dashboard'
            leftSection={<IconDashboard />}
            component={Link}
            to='/'
          />
          {user?.isAdmin && (
            <NavLink
              label='Questions'
              leftSection={<IconQuestionMark />}
              component={Link}
              to='/questions'
            />
          )}
        </AppShell.Section>
        <AppShell.Section mt='auto'>
          <Button
            w='100%'
            variant='light'
            color='red'
            leftSection={<IconLogout />}
            onClick={() => {
              tokenStorage.removeToken();
              router.navigate({ to: '/login' });
            }}
          >
            Log Out
          </Button>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
