import { Question, QuestionDoc, questionSchema } from '@common/shared-types';
import { Request, Response } from 'express';
import { collection } from "../model/collection";
import * as model from '../model/model';
import { DuplicateQuestionError } from "../utils/errors";

export async function getAll(complexity?: string, categories?: string[]): Promise<Question[]> {
  return model.getAll(complexity, categories);
}

export async function get(id: string): Promise<Question | null> {
  return model.get(id);
}

export async function create(questionDoc: QuestionDoc): Promise<Question> {
  // Guard against duplicates
  let existingQuestion: Question | null = await model.getByTitle(questionDoc.title);
  if (existingQuestion !== null) {
    throw new DuplicateQuestionError(existingQuestion);
  }

  // Create new question
  return model.create(questionDoc);
}

export async function updateQuestion(req: Request, res: Response) {
  try {
    const parsedRequestBody = questionSchema.omit({ id: true }).safeParse(req.body)
    if (!parsedRequestBody.success) {
      return res.status(400).json({ error: parsedRequestBody.error })
    }
    const { data } = parsedRequestBody

    const existingQuestionSnapshot = await collection.where('title', '==', data.title).get()

    if (!existingQuestionSnapshot.empty && existingQuestionSnapshot.docs.some(doc => doc.id !== req.params.id)) {
      return res.status(409).json({ error: 'A question with this title already exists' })
    }

    await collection.doc(req.params.id).set(data)
    res.status(200).json({ id: req.params.id, ...data })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update question' })
  }
}

export async function deleteQuestion(req: Request, res: Response) {
  try {
    await collection.doc(req.params.id).delete()
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete question' })
  }
}
