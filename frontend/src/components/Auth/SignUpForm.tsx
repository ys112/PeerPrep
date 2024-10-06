import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';

export function SignUpForm() {
  return (
    <form>
      <Stack>
        <TextInput label='Username' placeholder='Your username' required />
        <TextInput label='Email' placeholder='you@example.com' required />
        <PasswordInput label='Password' placeholder='Your password' required />
        <Button fullWidth mt='xl'>
          Sign up
        </Button>
      </Stack>
    </form>
  );
}
