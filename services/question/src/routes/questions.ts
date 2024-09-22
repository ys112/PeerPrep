import express from 'express'
import { getFirestore, Query } from 'firebase-admin/firestore'
import { db } from '../db/clients'
import { Question } from '../model'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const questionData: Question = req.body
    const docRef = await db.add(questionData)
    res.status(201).json({ id: docRef.id, ...questionData })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create question' })
  }
})

router.get('/', async (req, res) => {
  const { complexity, categories } = req.body

  try {
    let query: Query = db

    if (complexity) {
      query = query.where('complexity', '==', complexity)
    }

    const snapshot = await query.get()
    const questions: Question[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Question),
    }))

    let filteredQuestions = questions

    if (categories && Array.isArray(categories)) {
      filteredQuestions = questions.filter((question) => {
        return categories.every((value) => question.categories.includes(value))
      })
    }

    res.status(200).json(filteredQuestions)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const doc = await db.doc(req.params.id).get()
    if (!doc.exists) {
      return res.status(404).json({ error: 'Question not found' })
    }
    res.status(200).json({ id: doc.id, ...doc.data() })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch question' })
  }
})

router.put('/:id', async (req, res) => {
  const questionData: Partial<Question> = req.body
  try {
    await db.doc(req.params.id).update(questionData)
    res.status(200).json({ message: 'Question updated successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update question' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await db.doc(req.params.id).delete()
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete question' })
  }
})

export default router
