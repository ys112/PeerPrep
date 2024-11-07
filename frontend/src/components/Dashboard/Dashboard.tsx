import { User } from '@common/shared-types/dist';
import { Divider, Loader, Paper, Stack, Title } from "@mantine/core";
import { userStorage } from "../../utils/userStorage";

export function Dashboard() {
  let user: User = userStorage.getUser()!;

  return <>
		<Paper mb='md' p='md' withBorder radius='md' shadow='md'>
			<Stack ta='center'>
				<Title order={2}>Welcome, {user.username}</Title>
			</Stack>
		</Paper>
		<Paper mb='md' p='md' withBorder radius='md' shadow='md'>
			<Stack>
				<Title order={3}>History</Title>
				<Divider></Divider>
				<Loader mx='auto' color='lime' />
			</Stack>
		</Paper>
	</>;
}
