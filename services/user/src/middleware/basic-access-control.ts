import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { findUserById as _findUserById } from "../model/repository.js";

interface CustomRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    isAdmin: boolean;
  };
}

export function verifyAccessToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void | Response {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET as string, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const user = decoded as JwtPayload & { id: string };
    const dbUser = await _findUserById(user.id);
    if (!dbUser) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    req.user = {
      id: dbUser.id,
      username: dbUser.username,
      email: dbUser.email,
      isAdmin: dbUser.isAdmin,
    };

    next(); // Proceed to the next middleware
  });
}

// Middleware to verify if the user is an admin
export function verifyIsAdmin(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  if (req.user?.isAdmin) {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Not authorized to access this resource" });
  }
}

// Middleware to verify if the user is the owner or an admin
export function verifyIsOwnerOrAdmin(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  if (req.user?.isAdmin) {
    return next();
  }

  const userIdFromReqParams = req.params.id;
  const userIdFromToken = req.user?.id;

  if (userIdFromReqParams === userIdFromToken) {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Not authorized to access this resource" });
}
