import dotenv from 'dotenv'
if (process.env.NODE_ENV) {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
} else {
  dotenv.config({ path: '.env' })
}
import { extractedUserSchema, ExtractedUser } from '@common/shared-types'
import axios, { AxiosResponse } from 'axios'
import { StatusCodes } from 'http-status-codes'

export async function verifyUser(token: string): Promise<ExtractedUser | null> {
  // Contact user service
  let verificationResponse: AxiosResponse = await axios.get('/auth/verify-token', {
    baseURL: process.env.USER_SERVICE_URL,
    headers: {
      Authorization: token,
    },
  })
  if (verificationResponse.status !== StatusCodes.OK) {
    return null
  }

  let jsonBody: any = verificationResponse.data // Expect object containing message, data
  let rawUser: unknown = jsonBody.data
  let extractedUser = extractedUserSchema.safeParse(rawUser)

  if (!extractedUser.success) {
    return null
  }
  return extractedUser.data
}
