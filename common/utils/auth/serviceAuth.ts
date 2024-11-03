import { login } from "./userAuth";

export async function authenticateServiceUser(
  email: string | undefined,
  password: string | undefined
) {
  if (!email || !password) {
    throw new Error("Service user login not provided");
  }
  const loginResponse = await login({
    email: email,
    password: password,
  });

  const rawUserData = loginResponse;
  if (!rawUserData.isAdmin) {
    throw new Error("Service user is not an admin");
  }

  console.log("Service user authenticated successfully");

  return loginResponse.accessToken;
}
