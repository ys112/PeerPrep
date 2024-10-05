import { Question, QuestionDoc, questionDocSchema } from "@common/shared-types";
import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from "http-status-codes";
import { SafeParseReturnType } from "zod";
import * as controller from '../controller/controller';
import { DuplicateQuestionError } from "../utils/errors";

function parseQuestionDoc(req: Request, res: Response, next: NextFunction) {
  // Attempt to parse data
  let rawQuestionDoc: any = req.body;
  let result: SafeParseReturnType<QuestionDoc, QuestionDoc> =
    questionDocSchema.safeParse(rawQuestionDoc);

  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST);
    res.json({ error: result.error });
    return;
  }

  res.locals.questionDoc = result.data;
  next();
}

function genericServerError(res: Response, e: unknown) {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  res.json({ error: e});
}

let router: Router = Router();
export default router;

// GET all questions
router.get('/', async (req: Request, res: Response) => {
  let { complexity, categories } = req.body;
  let questions: Question[] = await controller.getAll(complexity, categories);

  res.status(StatusCodes.OK);
  res.json(questions);
});

// GET question with specified ID
router.get('/:id', async (req: Request, res: Response) => {
  let { params: { id } } = req;
  let question: Question | null = await controller.get(id);

  if (question === null) {
    res.status(StatusCodes.NOT_FOUND);
    res.json({ error: 'Question not found.' });
    return;
  }

  res.status(StatusCodes.OK);
  res.json(question);
});

// Create new specified question
router.post('/', parseQuestionDoc, async (req: Request, res: Response) => {
  let questionDoc: QuestionDoc = res.locals.questionDoc;

  try {
    let question: Question = await controller.create(questionDoc);

    res.status(StatusCodes.CREATED);
    res.json(question);
  } catch (e) {
    if (e instanceof DuplicateQuestionError) {
      res.status(StatusCodes.CONFLICT);
      res.json(e.duplicateQuestion);
      return;
    }

    genericServerError(res, e);
  }
});

// Overwrite specified question
router.put('/:id', parseQuestionDoc, async (req: Request, res: Response) => {
  let { params: { id } } = req;
  let questionDoc: QuestionDoc = res.locals.questionDoc;

  try {
    let question: Question = await controller.set(id, questionDoc);

    res.status(StatusCodes.OK);
    res.json(question);
  } catch (e) {
    if (e instanceof DuplicateQuestionError) {
      res.status(StatusCodes.CONFLICT);
      res.json(e.duplicateQuestion);
      return;
    }

    genericServerError(res, e);
  }
});

// DELETE specified question
router.delete('/:id', controller.deleteQuestion);
