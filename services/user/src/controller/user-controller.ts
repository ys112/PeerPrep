import bcrypt from "bcrypt";
import { isValidObjectId } from "mongoose";
import {
  createUser as _createUser,
  deleteUserById as _deleteUserById,
  findAllUsers as _findAllUsers,
  findUserByEmail as _findUserByEmail,
  findUserById as _findUserById,
  findUserByUsername as _findUserByUsername,
  findUserByUsernameOrEmail as _findUserByUsernameOrEmail,
  updateUserById as _updateUserById,
  updateUserPrivilegeById as _updateUserPrivilegeById,
} from "../model/repository.js";
import { Request, Response } from "express";

// Custom type for the user object
interface User {
  id: string;
  username: string;
  email: string;
  password: string; // You may want to omit this in the response
  isAdmin: boolean;
  createdAt: Date;
}

// Type for the formatUserResponse function parameter
type UserResponse = Omit<User, "password">; // Exclude password for response

export async function createUser(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const {
      username,
      email,
      password,
    }: { username: string; email: string; password: string } = req.body;

    if (username && email && password) {
      const existingUser = await _findUserByUsernameOrEmail(username, email);
      if (existingUser) {
        return res
          .status(409)
          .json({ message: "Username or email already exists" });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const createdUser = await _createUser(username, email, hashedPassword);
      return res.status(201).json({
        message: `Created new user ${username} successfully`,
        data: formatUserResponse(createdUser),
      });
    } else {
      return res
        .status(400)
        .json({ message: "Username, email, and/or password are missing" });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when creating new user!" });
  }
}

export async function getUser(req: Request, res: Response): Promise<Response> {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    } else {
      return res
        .status(200)
        .json({ message: `Found user`, data: formatUserResponse(user) });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when getting user!" });
  }
}

export async function getAllUsers(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const users: User[] = await _findAllUsers();
    return res
      .status(200)
      .json({ message: `Found users`, data: users.map(formatUserResponse) });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when getting all users!" });
  }
}

export async function updateUser(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const {
      username,
      email,
      password,
    }: { username?: string; email?: string; password?: string } = req.body;
    const userId = req.params.id;

    if (username || email || password) {
      if (!isValidObjectId(userId)) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }

      const user = await _findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }

      if (username || email) {
        let existingUser = await _findUserByUsername(username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ message: "Username already exists" });
        }
        existingUser = await _findUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ message: "Email already exists" });
        }
      }

      let hashedPassword: string | undefined;
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        hashedPassword = bcrypt.hashSync(password, salt);
      }

      const updatedUser = await _updateUserById(
        userId,
        username,
        email,
        hashedPassword
      );
      return res.status(200).json({
        message: `Updated data for user ${userId}`,
        data: formatUserResponse(updatedUser),
      });
    } else {
      return res.status(400).json({
        message:
          "No field to update: username, email, and password are all missing!",
      });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when updating user!" });
  }
}

export async function updateUserPrivilege(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { isAdmin }: { isAdmin?: boolean } = req.body;
    const userId = req.params.id;

    if (isAdmin !== undefined) {
      // isAdmin can have boolean value true or false
      if (!isValidObjectId(userId)) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }

      const user = await _findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }

      const updatedUser = await _updateUserPrivilegeById(
        userId,
        isAdmin === true
      );
      return res.status(200).json({
        message: `Updated privilege for user ${userId}`,
        data: formatUserResponse(updatedUser),
      });
    } else {
      return res.status(400).json({ message: "isAdmin is missing!" });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when updating user privilege!" });
  }
}

export async function deleteUser(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    await _deleteUserById(userId);
    return res
      .status(200)
      .json({ message: `Deleted user ${userId} successfully` });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when deleting user!" });
  }
}

export function formatUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  };
}
