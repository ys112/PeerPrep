import { Request, Response } from 'express'
import { db } from '../db/clients'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../model'

interface UserRequest extends Request {
  user?: {
    id: string
    username: string
    email: string
    isAdmin: boolean
  }
}

export async function handleLogin(req: Request, res: Response) {
  const { email, password }: { email: string; password: string } = req.body

  if (email && password) {
    try {
      const userSnapshot = await db.where('email', '==', email).get()
      if (!userSnapshot) {
        return res.status(401).json({ message: 'Wrong email and/or password' })
      }
      const userDoc = userSnapshot.docs[0]
      const userData = userDoc.data() as User

      // Check password using bcrypt
      const match = await bcrypt.compare(password, userData.password)
      if (!match) {
        return res.status(401).json({ message: 'Wrong email and/or password' })
      }

      const accessToken = jwt.sign(
        { id: userDoc.id },
        process.env.JWT_SECRET as string, // Ensure the JWT secret is a string
        { expiresIn: '1d' }
      )

      return res.status(200).json({
        message: 'User logged in',
        data: {
          accessToken,
          username: userData.username,
          email: userData.email,
          isAdmin: userData.isAdmin,
        },
      })
    } catch (err) {
      return res.status(500).json({ message: (err as Error).message }) // Cast err to Error
    }
  } else {
    return res.status(400).json({ message: 'Missing email and/or password' })
  }
}

export async function handleVerifyToken(
  req: UserRequest,
  res: Response
): Promise<Response> {
  try {
    const verifiedUser = req.user // Ensure req.user has the correct type if you're extending Request
    return res.status(200).json({ message: 'Token verified', data: verifiedUser })
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message }) // Cast err to Error
  }
}
