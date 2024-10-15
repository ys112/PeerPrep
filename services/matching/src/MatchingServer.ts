import { Queue } from 'bullmq'
import { UserMatchingData, UserTicket } from './types/user-data'
import MatchingQueueManager from './queue-manager/MatchingQueueManager'
import { Server as SocketIOServer, ServerOptions, Socket } from 'socket.io'
import { Server as HttpServer } from 'http'
import { MessageType } from './types/events'
import logger from './utils/logger'
import Matcher from './worker/Matcher'
import Sorter from './worker/Sorter'
import { getTicketId } from './utils/ticketid'

const SORTING_QUEUE_NAME = 'sorting'

export default class MatchingServer {
  private readonly _matchingQueueManager: MatchingQueueManager
  private readonly _sortingQueue: Queue<UserTicket, void>
  private readonly _sorter: Sorter
  private readonly _webSocketServer: SocketIOServer

  constructor(httpServer: HttpServer, options?: ServerOptions) {
    this._matchingQueueManager = new MatchingQueueManager()
    this._sortingQueue = new Queue(SORTING_QUEUE_NAME)
    this._webSocketServer = new SocketIOServer(httpServer, options)
    this._sorter = new Sorter(SORTING_QUEUE_NAME, this._matchingQueueManager)

    this._webSocketServer.on('connection', this.onConnection.bind(this))
  }

  private async onConnection(socket: Socket) {
    // TODO: Authenticate the user

    socket.on(MessageType.MATCH_REQUEST, (data: UserMatchingData) =>
      this.onMatchingRequest(data, socket)
    )
  }

  private async onMatchingRequest(data: UserMatchingData, socket: Socket) {
    try {
      const ticket: UserTicket = {
        ticketId: getTicketId(data),
        data: data,
      }
      const job = await this._sortingQueue.add(ticket.ticketId, ticket, {
        jobId: ticket.ticketId,
        deduplication: {
          id: data.userId,
          ttl: 10000, // cooldown in milliseconds, avoid spamming
        },
      })
      socket.emit(MessageType.MATCH_REQUEST_QUEUED, job.id)
    } catch (error) {
      logger.error(`Error processing matching request: ${error}`)
      if (error instanceof Error) {
        logger.error(error.stack)
      }
      socket.emit(MessageType.MATCH_REQUEST_FAILED)
    }
  }
}
