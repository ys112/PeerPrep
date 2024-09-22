import dotenv from 'dotenv'
if (process.env.NODE_ENV) {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
} else {
  dotenv.config({ path: '.env' })
}

import { db } from '../db/clients'
import fs from 'fs/promises'
import logger from '../utils/logger'

const dataPath = './data/questions.json'

type Question = {
  title: string
  description: string
  categories: string[]
  complexity: "Easy" | "Medium" | "Hard"
}

fs.readFile(dataPath, 'utf-8').then(
  (raw) => {
    try {
      const data = JSON.parse(raw) as Question[]
      Promise.all(data.map(async (question) => {
        await db.add(question)
      }))
    } catch (error) {
      logger.error(error)
    }
  }
)