import { getDocument, storeDocument } from './controller/doc-controller'
import { verifyUser } from './utils/verifyToken'

async function startServer() {
  const { Server } = await import('@hocuspocus/server')
  const { Logger } = await import('@hocuspocus/extension-logger')
  const { Database } = await import('@hocuspocus/extension-database')

  const server = Server.configure({
    port: 3004,
    timeout: 30000,
    // debounce: 5000,
    // maxDebounce: 30000,
    // quiet: true,
    async onAuthenticate(data) {
      const { token } = data
      const user = await verifyUser(token)
      if (!user) {
        throw new Error('Not authorized!')
      }
      return user
    },
    extensions: [
      new Logger({
        log: (message) => {
          // do something custom here
          console.log(message)
        },
      }),
      new Database({
        // Retrieve the document in firestore
        fetch: async ({ documentName }) => {
          return getDocument(documentName)
        },
        // Store the document in firestore
        store: async ({ documentName, state }) => {
          storeDocument(documentName, state)
        },
      }),
    ],
  })

  server.listen()
}

startServer()
