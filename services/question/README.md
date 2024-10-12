# Question Service

## Development Instructions

Unless otherwise specified, commands should be run in the service root.

### Running the service (development)

1. Run `npm run dev` to run the dev script.
1. Open your browser at <http://localhost:3001>.

### Running tests

1. Run `npm test` to run the test script.

## Documentation

### Database client

- The database client is defined in `./src/db/clients.ts`. It connects to Google Cloud Datastore (Firestore).
- Connecting to Firestore requires service account credentials file. The path to the file must be set in the environment variable `GOOGLE_APPLICATION_CREDENTIALS`.
- The client looks for the `COLLECTION_NAME` environment variable to determine the collection name to use in Firestore.

### Environment variables

- `GOOGLE_APPLICATION_CREDENTIALS`: Path to the service account credentials file for Firestore.
- `USER_SERVICE_URL`: The URL to the user service.
- `PORT` (optional): Port to run the service on. Defaults to `3000` as per `index.ts`.
- `COLLECTION_NAME` (optional): Name of the collection in Firestore. Defaults to `questions` as per `clients.ts`.
- `CORS_ORIGINS` (optional): Allow list for CORS, as parseable JSON. Defaults to `'*'` as per `index.ts`.

### Routes

All routes start with `/questions` as the base route.

- `POST /questions`: Create a new question.
- `GET /questions`: Get all questions. If `complexity` or `categories` are stated in the request body, questions returned will be filtered according to the fields specified.
- `GET /questions/:id`: Get a question by ID.
- `PUT /questions/:id`: Update a question by ID.
- `DELETE /questions/:id`: Delete a question by ID

### Database schema

`src/model.ts`

### Example data

Sample data can be found in `data/questions.json`.

### Tests

**Jest** is used for testing.

Tests are stored in the `src/__tests__/` folder. Its hierarchy mirrors that of `src/`, with `.test` prepended before the file extension.\
e.g. the tests for `src/controller/controller.ts` are in `src/__tests__/controller/controller.test.ts`.
