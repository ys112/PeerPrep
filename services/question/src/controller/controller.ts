/* [Imports] */

import { Question, questionSchema } from '@common/shared-types';
import { Request, Response } from 'express';
import { collection } from "../model/collection";
import * as model from '../model/model';

/* [Main] */

export async function getAll(complexity?: string, categories?: string[]): Promise<Question[]> {
  return model.getAll(complexity, categories);
}

export async function getQuestion(req: Request, res: Response) {
  try {
    const doc = await collection.doc(req.params.id).get()
    if (!doc.exists) {
      return res.status(404).json({ error: 'Question not found' })
    }
    res.status(200).json({ id: doc.id, ...doc.data() })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch question' })
  }
}

export async function createQuestion(req: Request, res: Response) {
  try {
    const parsedRequest = questionSchema.omit({ id: true }).safeParse(req.body)
    if (!parsedRequest.success) {
      return res.status(400).json({ error: parsedRequest.error })
    }
    const { data } = parsedRequest

    const existingQuestionSnapshot = await collection.where('title', '==', data.title).get()

    if (!existingQuestionSnapshot.empty) {
      return res.status(409).json({ error: 'A question with this title already exists' })
    }

    const newQuestionRef = await collection.add(data)
    res.status(201).json({ id: newQuestionRef.id, ...data })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create question' })
  }
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
