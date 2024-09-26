# Question Service
Question service for PeerPrep.

## Database client
- The database client is defined in `./src/db/clients.ts`. It connects to Google Cloud Datastore (Firestore).
- Connecting to Firestore requires service account credentials file. The path to the file must be set in the environment variable `GOOGLE_APPLICATION_CREDENTIALS`.
- The client looks for the `COLLECTION_NAME` environment variable to determine the collection name to use in Firestore.

## Environment variables
- `PORT`: Port to run the service on.
- `COLLECTION_NAME`: Name of the collection in Firestore to use.
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to the service account credentials file for Firestore.

To use `.env.development` or `.env.production`, set the `NODE_ENV` to `development` or `production` and put this code on top of the entry file:
```typescript
import dotenv from 'dotenv'
if (process.env.NODE_ENV) {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
} else {
  dotenv.config({ path: '.env' })
}
```

## Routes
All routes start with `/questions` as the base route.
- `POST /questions`: Create a new question.
- `GET /questions`: Get all questions. If `complexity` or `categories` are stated in the request body, questions returned will be filtered according to the fields specified.
- `GET /questions/:id`: Get a question by ID.
- `PUT /questions/:id`: Update a question by ID.
- `DELETE /questions/:id`: Delete a question by ID

## Database schema
`src/model.ts`
```typescript
export type Question = {
  title: string
  description: string
  categories: string[]
  complexity: "Easy" | "Medium" | "Hard"
}
```

## Example data
Sample data can be found in `data/questions.json`.
