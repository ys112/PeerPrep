import { Router } from 'express'
import {
  getAllQuestionsWithConditions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controller/questions'

const router = Router()

router.get('/', getAllQuestionsWithConditions)

router.get('/:id', getQuestion)

router.post('/', createQuestion)

router.put('/:id', updateQuestion)

router.delete('/:id', deleteQuestion)

export default router
