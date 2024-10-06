import { User } from "@common/shared-types";
import {
  ActionIcon,
  Button,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { api } from "../../api/client";

export const userSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  isAdmin: z.boolean(),
  createdAt: z.date(),
});

export const sensitiveUserSchema = userSchema.extend({
  password: z.string().min(1),
});

// Use shared zod object to validate form
const loginFormSchema = sensitiveUserSchema.pick({
  email: true,
  password: true,
});

const registerFormSchema = sensitiveUserSchema.pick({
  email: true,
  username: true,
  password: true,
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function LoginPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const { mutateAsync: loginUserMutation } = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      try {
        return await api.userClient.loginUser(values);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData<User>(["user"], data);
      form.reset();
      router.navigate({ to: "/" });
    },
    onError: (error) => {
      if (error.message.includes("401")) {
        form.setErrors({ email: error.message });
      } else {
        notifications.show({
          color: "red",
          title: "Error logging in",
          message: `${error.message}`,
        });
      }
    },
  });

  const { mutateAsync: registerUserMutation } = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      try {
        return await api.userClient.registerUser(values);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData<User>(["user"], data);
      form.reset();
      router.navigate({ to: "/" });
    },
    onError: (error) => {
      if (error.message.includes("409")) {
        form.setErrors({ email: error.message, username: error.message });
      } else {
        notifications.show({
          color: "red",
          title: "Error logging in",
          message: `${error.message}`,
        });
      }
    },
  });

  const form = useForm<LoginFormValues | RegisterFormValues>({
    initialValues: isLogin
      ? { email: "", password: "" }
      : {
          username: "",
          email: "",
          password: "",
        },
    validate: zodResolver(isLogin ? loginFormSchema : registerFormSchema),
  });

  return (
    <Stack h="100vh" align="center" justify="center">
      <Paper ta="center" shadow="md" p="xl" withBorder>
        {isLogin ? (
          <>
            <Title>Practice at PeerPrep!</Title>
            <Text size="lg">Please login to continue</Text>
          </>
        ) : (
          <Group>
            <ActionIcon size="lg" color="grey" onClick={() => setIsLogin(true)}>
              <IconArrowLeft />
            </ActionIcon>

            <Title>Fill in your information below</Title>
          </Group>
        )}
        <form
          onSubmit={form.onSubmit(
            async (values: LoginFormValues | RegisterFormValues) =>
              await (isLogin
                ? loginUserMutation(values as LoginFormValues)
                : registerUserMutation(values as RegisterFormValues))
          )}
        >
          {!isLogin && (
            <TextInput
              label="Username"
              placeholder=""
              required
              key={form.key("username")}
              {...form.getInputProps("username")}
            />
          )}
          <TextInput
            label="Email"
            placeholder="you@gmail.com"
            required
            key={form.key("email")}
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label="Password"
            required
            key={form.key("password")}
            {...form.getInputProps("password")}
          />
          <Stack mt="md">
            <Button type="submit">{isLogin ? "Login" : "Submit"}</Button>
            {isLogin && (
              <Button
                w="100%"
                variant="light"
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </Button>
            )}
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}

export default LoginPage;
