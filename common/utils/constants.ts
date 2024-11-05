import fs from 'fs';

function readFromEnvPath(variableName: string): string {
  let path: string | undefined = process.env[variableName];

  if (path === undefined) {
    throw new Error(`Environment variable ${variableName} is not set!`)
  }

  return fs.readFileSync(path, 'utf8')
}

export const SERVICE_API_KEY: string = readFromEnvPath("SERVICE_API_KEY_PATH");
export const JWT_SECRET: string = readFromEnvPath("JWT_SECRET_PATH");
