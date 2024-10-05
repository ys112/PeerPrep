import { Question } from "@common/shared-types";

export class DuplicateQuestionError extends Error {
  constructor(message: string, public existingQuestion: Question) {
    super(message)
  }
}
