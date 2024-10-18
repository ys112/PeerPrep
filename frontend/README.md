## Getting Started

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone git@github.com:CS3219-AY2425S1/cs3219-ay2425s1-project-g20.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the local development server
   ```sh
   npm run dev
   ```

### Environment Variables

Set variables in .env.development for development and .env.prod for production.

-`VITE_QUESTION_SERVICE_API_URL`: The question service API url (e.g. http://localhost:3001) -`VITE_USER_SERVICE_API_URL`: The user service API url (e.g. http://localhost:3002) -`VITE_MATCH_SERVICE_API_URL`: The match service API url (e.g. ws://localhost:3003)

For more details on how .env in VITE works:
https://vitejs.dev/guide/env-and-mode
