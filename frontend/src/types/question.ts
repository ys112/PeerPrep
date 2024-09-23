export interface Question {
  id: number;
  title: string;
  description: string;
  categories: string[];
  complexity: "Easy" | "Medium" | "Hard";
}

// This type is used in the form to allow id to be optional when creating a new question
export type QuestionWithOptional = Omit<Question, "id" | "complexity"> & {
  id?: number;
  complexity?: "" | "Easy" | "Medium" | "Hard";
};
