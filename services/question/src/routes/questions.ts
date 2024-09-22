import express from 'express'
import { getFirestore } from 'firebase-admin/firestore'
import { db } from '../db/clients'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const questionData = req.body
    const docRef = await db.add(questionData)
    res.status(201).json({ id: docRef.id, ...questionData })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create question' })
  }
})

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.get()
    const questions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.status(200).json(questions)
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
  try {
    await db.doc(req.params.id).update(req.body)
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
