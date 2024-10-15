import { redisConfig } from '../constants/redis'
import MatchingQueueManager from '../queue-manager/MatchingQueueManager'
import { UserMatchingData, UserTicket } from '../types/user-data'
import logger from '../utils/logger'
import { Job, Worker } from 'bullmq'

export default class Sorter {
  private _worker: Worker
  private _queueManager: MatchingQueueManager

  constructor(queueName: string, queueManager: MatchingQueueManager) {
    this._queueManager = queueManager
    this._worker = new Worker<UserTicket, void>(queueName, this.processor.bind(this), {
      connection: redisConfig,
      concurrency: 5, // can change this, just an example now
    })
  }

  async processor(job: Job<UserTicket, void, string>) {
    logger.info(`Processing job ${job.id}`)
    this._queueManager.addJob(job, job.name)
  }
}
