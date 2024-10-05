import { Router } from 'express'
import {
  createQuestion,
  deleteQuestion,
  getAllQuestionsWithConditions,
  getQuestion,
  updateQuestion,
} from '../controller/controller'

const router = Router()

router.get('/', getAllQuestionsWithConditions)

router.get('/:id', getQuestion)

router.post('/', createQuestion)

router.put('/:id', updateQuestion)

router.delete('/:id', deleteQuestion)

export default router
