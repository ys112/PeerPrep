import z from "zod";

export const questionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  categories: z.string().min(1).array().min(1),
  complexity: z.enum(["Easy", "Medium", "Hard"]),
});

export const userSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  isAdmin: z.boolean(),
  createdAt: z.date(),
});


export type User = z.infer<typeof userSchema>;
export type Question = z.infer<typeof questionSchema>;
