import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { Query } from 'firebase-admin/firestore'
import { db } from '../db/clients'
import { User } from '../model'

// Type for the formatUserResponse function parameter
type UserResponse = Omit<User, 'password'> // Exclude password for response

export async function createUser(req: Request, res: Response): Promise<Response> {
  try {
    const {
      username,
      email,
      password,
    }: { username: string; email: string; password: string } = req.body

    if (username && email && password) {
      const existingUser = await findUserByUsernameOrEmail(username, email)
      if (existingUser) {
        return res.status(409).json({ message: 'Username or email already exists' })
      }

      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(password, salt)

      const createdUser = {
        username,
        email,
        password: hashedPassword,
        isAdmin: false,
        createdAt: new Date(),
      }

      const userDoc = await db.add(createdUser)
      return res.status(201).json({
        message: `Created new user ${username} successfully`,
        data: { id: userDoc.id, ...createdUser },
      })
    } else {
      return res
        .status(400)
        .json({ message: 'Username, email, and/or password are missing' })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Unknown error when creating new user!' })
  }
}

export async function getUser(req: Request, res: Response): Promise<Response> {
  try {
    const userId = req.params.id
    const userDoc = await db.doc(userId).get()

    if (!userDoc.exists) {
      return res.status(404).json({ message: `User ${userId} not found` })
    } else {
      return res.status(200).json({
        message: `Found user`,
        data: { id: userDoc.id, ...(userDoc.data() as User) },
      })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Unknown error when getting user!' })
  }
}

export async function getAllUsers(req: Request, res: Response): Promise<Response> {
  try {
    const usersSnapshot = await db.get()
    const users: UserResponse[] = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as User),
    }))

    return res.status(200).json({ message: `Found users`, data: users })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Unknown error when getting all users!' })
  }
}

export async function updateUser(req: Request, res: Response): Promise<Response> {
  try {
    const {
      username,
      email,
      password,
    }: { username?: string; email?: string; password?: string } = req.body
    const userId = req.params.id

    if (username || email || password) {
      const userDoc = await db.doc(userId).get()
      if (!userDoc.exists) {
        return res.status(404).json({ message: `User ${userId} not found` })
      }

      const userData = userDoc.data() as User

      if (username || email) {
        const existingUser = await findUserByUsernameOrEmail(username, email)
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ message: 'Username or email already exists' })
        }
      }

      let hashedPassword: string | undefined
      if (password) {
        const salt = bcrypt.genSaltSync(10)
        hashedPassword = bcrypt.hashSync(password, salt)
      }

      await db.doc(userId).update({
        username: username || userData.username,
        email: email || userData.email,
        password: hashedPassword || userData.password,
      })

      return res.status(200).json({
        message: `Updated data for user ${userId}`,
        data: { id: userDoc.id, ...userData },
      })
    } else {
      return res.status(400).json({
        message: 'No field to update: username, email, and password are all missing!',
      })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Unknown error when updating user!' })
  }
}

export async function updateUserPrivilege(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { isAdmin }: { isAdmin?: boolean } = req.body
    const userId = req.params.id

    if (isAdmin !== undefined) {
      const userDoc = await db.doc(userId).get()
      if (!userDoc.exists) {
        return res.status(404).json({ message: `User ${userId} not found` })
      }

      await db.doc(userId).update({ isAdmin })

      const updatedUser = userDoc.data() as User

      return res.status(200).json({
        message: `Updated privilege for user ${userId}`,
        data: { id: userDoc.id, ...updatedUser },
      })
    } else {
      return res.status(400).json({ message: 'isAdmin is missing!' })
    }
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({ message: 'Unknown error when updating user privilege!' })
  }
}

export async function deleteUser(req: Request, res: Response): Promise<Response> {
  try {
    const userId = req.params.id
    const userDoc = await db.doc(userId).get()
    if (!userDoc.exists) {
      return res.status(404).json({ message: `User ${userId} not found` })
    }

    await db.doc(userId).delete()
    return res.status(200).json({ message: `Deleted user ${userId} successfully` })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Unknown error when deleting user!' })
  }
}

// Helper function to find a user by username or email
async function findUserByUsernameOrEmail(
  username: string | undefined,
  email: string | undefined
) {
  // Build the query to search for users based on username and email
  let query: Query = db

  // Add filters to the query only if username or email is defined
  if (username) {
    query = query.where('username', '==', username)
  }
  if (email) {
    query = query.where('email', '==', email)
  }

  const snapshot = await query.get()

  // Check if the snapshot is not empty
  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0]
    return { id: userDoc.id, ...(userDoc.data() as User) } // Return user data without id
  }
  return null // Return null if no user is found
}
