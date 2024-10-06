import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';

export function LoginForm() {
  return (
    <form>
      <Stack>
        <TextInput label='Email' placeholder='you@example.com' required />
        <PasswordInput label='Password' placeholder='Your password' required />
        <Button fullWidth mt='xl'>
          Login
        </Button>
      </Stack>
    </form>
  );
}
