import fs from 'fs'

function getJwtSecret(): string {
  if (process.env.JWT_SECRET_PATH === undefined) {
    throw new Error('JWT_SECRET and JWT_SECRET_PATH is not set')
  }

  return fs.readFileSync(process.env.JWT_SECRET_PATH!, 'utf8')
}

export const jwtSecret = getJwtSecret()
