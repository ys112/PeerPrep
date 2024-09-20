export interface Question {
  id: number;
  title: string;
  description: string;
  categories: string;
  complexity: string;
  link: string;
}

export type QuestionWithOptionalId = Omit<Question, "id"> & { id?: number };
