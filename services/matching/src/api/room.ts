import axios from 'axios'
import { UserMatchDoneData, UserRoomCreatedData } from '@common/shared-types'
import { authenticateServiceUser } from '@common/utils'
import logger from '../utils/logger'
import { configEnv } from '@common/utils'
configEnv()

// Auth with user service
const SERVICE_USER_EMAIL = process.env.SERVICE_USER_EMAIL
const SERVICE_USER_PASSWORD = process.env.SERVICE_USER_PASSWORD

let accessToken: string | null = null

async function getAccessToken() {
  try {
    if (!accessToken) {
      accessToken = await authenticateServiceUser(
        SERVICE_USER_EMAIL,
        SERVICE_USER_PASSWORD
      )
    }
    return accessToken
  } catch (error) {
    accessToken = null
    logger.error(error)
  }
}

const axiosInstance = axios.create({
  baseURL: process.env.ROOM_SERVICE_URL || 'http://localhost:3004',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + getAccessToken(),
  },
})

// Set authorization header
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken()

    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    } else {
      logger.error('No token found when authorizing service')
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

async function refreshToken() {
  accessToken = null
  axiosInstance.defaults.headers.Authorization = 'Bearer ' + (await getAccessToken())
}

export async function createRoom(
  userMatchDoneData: UserMatchDoneData
): Promise<UserRoomCreatedData | null> {
  try {
    const response = await axiosInstance.post('/room', userMatchDoneData)

    if (response.status !== 200) {
      throw new Error('Error creating room')
    }

    return response.data.data as UserRoomCreatedData
  } catch (error) {
    if (error instanceof Response && error.status === 401) {
      accessToken = null
      refreshToken()
      return createRoom(userMatchDoneData)
    }
    throw error
  }
}
