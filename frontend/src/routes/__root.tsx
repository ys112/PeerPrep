import {
  AppShell,
  Box,
  Burger,
  Button,
  Flex,
  Group,
  NavLink,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDashboard,
  IconDashboardFilled,
  IconDashboardOff,
  IconDoorExit,
  IconLogout,
  IconQuestionMark,
} from "@tabler/icons-react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: "sm" }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            {/* Change this to logo when we have one */}
            <Text fw="bold">PeerPrep</Text>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <AppShell.Section>
            <NavLink
              label="Dashboard"
              leftSection={<IconDashboard />}
              component={Link}
              to="/"
            />
            <NavLink
              label="Questions"
              leftSection={<IconQuestionMark />}
              component={Link}
              to="/questions"
            />
          </AppShell.Section>
          <AppShell.Section mt="auto">
            <Button
              w="100%"
              variant="light"
              color="red"
              leftSection={<IconLogout />}
            >
              Log Out
            </Button>
          </AppShell.Section>
        </AppShell.Navbar>

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
