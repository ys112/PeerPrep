import dotenv from 'dotenv'
if (process.env.NODE_ENV) {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
} else {
  dotenv.config({ path: '.env' })
}

import express from 'express'
import { db } from './db/clients'
import logger from './utils/logger'

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Welcome to question service root!')
})

app.get('/questions', async (req, res) => {
  try {
    const snapshot = await db.get()
    const questions = snapshot.docs.map((doc) => doc.data())
    res.json(questions)
  } catch (error) {
    logger.error(error)
    res.status(500).send('Internal server error')
  }
})

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`)
})
