import { db } from './db/clients'
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

      console.log('token', token)
      // const user = verifyUser(token)

      // return user
      return 'user'
    },
    extensions: [
      new Logger({
        log: (message) => {
          // do something custom here
          console.log(message)
        },
      }),
      new Database({
        // Return a Promise to retrieve data …
        fetch: async ({ documentName }) => {
          return new Promise(async (resolve, reject) => {
            console.log('fetching', documentName)
            const response = await db.doc(documentName).get()

            if (!response) {
              reject(response)
            }

            resolve(response.data() as Uint8Array)

            // this.db?.get(
            //   `
            //   SELECT data FROM "documents" WHERE name = $name ORDER BY rowid DESC
            // `,
            //   {
            //     $name: documentName,
            //   },
            //   (error, row) => {
            //     if (error) {
            //       reject(error)
            //     }
            //     resolve(row?.data)
            //   }
            // )
          })
        },
        // … and a Promise to store data:
        store: async ({ documentName, state }) => {
          console.log('storing', documentName)
          const response = await db.doc(documentName).set(
            {
              data: state,
            },
            { merge: true }
          )
          // this.db?.run(
          //   `
          //   INSERT INTO "documents" ("name", "data") VALUES ($name, $data)
          //     ON CONFLICT(name) DO UPDATE SET data = $data
          // `,
          //   {
          //     $name: documentName,
          //     $data: state,
          //   }
          // )
        },
      }),
    ],
  })

  server.listen()
}

startServer()
