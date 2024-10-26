# Collaboration Service

A service to connect users with live collaboration sessions.

## Development Instructions

Unless otherwise specified, commands should be run in the service root.

### Running the service (development) 
`pnpm dev` : Run the dev script for this collaboration service.


## Environment Variables
  
  `.env`:
- `PORT` (optional): Port to run the service on.
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to the service account credentials file for Firestore.
- `COLLECTION_NAME` (optional): Name of the collection to use in Firestore.