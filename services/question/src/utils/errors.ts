import { Question } from "@common/shared-types";

export class DuplicateQuestionError extends Error {
  constructor(public existingQuestion: Question) {
    super('A similar question already exists!');
  }
}
