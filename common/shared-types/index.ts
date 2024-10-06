import z from 'zod';

export const questionDocSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  categories: z.string().min(1).array().min(1),
  complexity: z.enum(["Easy", "Medium", "Hard"]),
});
export const questionSchema = questionDocSchema.extend({
  id: z.string().min(1),
});

export type QuestionDoc = z.infer<typeof questionDocSchema>
export type Question = z.infer<typeof questionSchema>
