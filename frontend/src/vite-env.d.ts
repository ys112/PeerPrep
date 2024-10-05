// Adapted from https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript
interface ImportMetaEnv {
  readonly VITE_QUESTIONS_SERVICE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
