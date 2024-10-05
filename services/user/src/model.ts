import z from 'zod'
import { Request } from 'express'

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type LoginRequest = z.infer<typeof loginRequestSchema>

export const userRequestSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
})

export type UserRequest = z.infer<typeof userRequestSchema>

export const extractedUserSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email(),
  isAdmin: z.boolean(),
})

export type ExtractedUser = z.infer<typeof extractedUserSchema>

export interface VerifyRequest extends Request {
  user?: ExtractedUser
}

export const isAdminSchema = z.object({
  isAdmin: z.boolean(),
})

export type IsAdminRequest = z.infer<typeof isAdminSchema>

export const userSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  isAdmin: z.boolean(),
  createdAt: z.date(),
})

export type User = z.infer<typeof userSchema>
