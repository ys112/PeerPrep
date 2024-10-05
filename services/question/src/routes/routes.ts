import { Question } from "@common/shared-types";
import { Request, Response, Router } from 'express';
import { StatusCodes } from "http-status-codes";
import * as controller from '../controller/controller';

let router: Router = Router();
export default router;

router.get('/', async (req: Request, res: Response) => {
  let { complexity, categories } = req.body;
  let questions: Question[] = await controller.getAll(complexity, categories);

  res.status(StatusCodes.OK);
  res.json(questions);
});

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

//TODO
router.post('/', controller.createQuestion);

router.put('/:id', controller.updateQuestion);

router.delete('/:id', controller.deleteQuestion);
