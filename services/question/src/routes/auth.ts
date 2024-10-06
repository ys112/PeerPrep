import { User, userSchema } from '@common/shared-types';
import axios, { AxiosResponse } from 'axios';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SafeParseReturnType } from 'zod';

/* [Main] */

async function verifyUser(token: string): Promise<User | null> {
  // Contact user service
  let verificationResponse: AxiosResponse = await axios.get('/auth/verify-token', {
    baseURL: process.env.USER_SERVICE_URL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (verificationResponse.status !== StatusCodes.OK) {
    return null;
  }

  let jsonBody: any = verificationResponse.data; // Expect object containing message, data
  let rawUser: unknown = jsonBody.data;
  let result: SafeParseReturnType<User, User> =
    userSchema.safeParse(rawUser);
  if (!result.success) {
    // StatusCodes.SERVICE_UNAVAILABLE
    return null;
  }

  return result.data;
}

/* [Exports] */

// Provides the verified user to subsequent middleware
export async function requireLogin(req: Request, res: Response, next: NextFunction) {
  let userToken: string = req.body.token;
  if (userToken === undefined) {
    res.status(StatusCodes.UNAUTHORIZED);
    res.send();
    return;
  }

  let user: User | null = await verifyUser(userToken);
  if (user === null) {
    res.status(StatusCodes.UNAUTHORIZED);
    res.send();
    return;
  }

  res.locals.user = user;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  let user: User = res.locals.user;

  if (!user.isAdmin) {
    res.status(StatusCodes.FORBIDDEN);
    res.send();
    return;
  }
  next();
}
