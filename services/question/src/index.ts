import dotenv from 'dotenv'
if (process.env.NODE_ENV) {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
} else {
  dotenv.config({ path: '.env' })
}

import express from 'express'
import { db } from './db/clients'
import logger from './utils/logger'
import router from './routes/questions'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use('/questions', router)

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`)
})
