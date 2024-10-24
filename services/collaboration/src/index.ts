//References: https://github.com/yjs/y-websocket/blob/master/bin/server.cjs
import { configEnv } from '@common/utils'
configEnv()

// import express from 'express'
import logger from './utils/logger'
import cors from 'cors'

import { WebSocket } from 'ws'
import * as Y from 'yjs'
import http from 'http'

// Currently using the default connection setup from y-websocket
// @ts-ignore
import yUtils from 'y-websocket/bin/utils'

// const app = express()
const port = process.env.PORT || 3004

// app.use(express.json())
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGINS ? JSON.parse(process.env.CORS_ORIGINS) : '*',
//   })
// )

const server = http.createServer((_request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('okay')
})
const wss = new WebSocket.Server({ server })

wss.on('connection', yUtils.setupWSConnection)

// server.on('upgrade', (request, socket, head) => {
//   // You may check auth of request here..
//   // Call `wss.handleUpgrade` *after* you checked whether the client has access
//   // (e.g. by checking cookies, or url parameters).
//   // See https://github.com/websockets/ws#client-authentication
//   wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
//     wss.emit('connection', ws, request)
//   })
// })

server.listen(port, () => {
  logger.info(`Server is running on ws://localhost:${port}`)
})
