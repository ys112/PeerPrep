import { User } from '@common/shared-types/dist';
import { Divider, Group, Loader, Paper, Stack, Title } from "@mantine/core";
import { userStorage } from "../../utils/userStorage";

export function Dashboard() {
  let user: User = userStorage.getUser()!;

  return <Stack>
		<Title order={1} ta='center' >Welcome, {user.username}</Title>
		<Group>
			<Paper w={{ base: '100%', lg: '50%' }} mx='auto' p='md' withBorder radius='md' shadow='md'>
				<Stack>
					<Title order={2}>History</Title>
					<Divider></Divider>
					<Loader mx='auto' color='lime' />
				</Stack>
			</Paper>
		</Group>
	</Stack>;
}
