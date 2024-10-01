import z from 'zod'

export const userSchema = z.object({
  username: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(1),
  isAdmin: z.boolean(),
  createdAt: z.date(),
})

export type User = z.infer<typeof userSchema>
