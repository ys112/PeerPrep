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

//TODO
router.get('/:id', controller.getQuestion);

router.post('/', controller.createQuestion);

router.put('/:id', controller.updateQuestion);

router.delete('/:id', controller.deleteQuestion);
