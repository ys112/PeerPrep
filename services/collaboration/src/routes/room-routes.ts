import {
  ExtractedUser,
  userMatchDoneDataSchema,
  userRoomCreatedDataSchema,
} from '@common/shared-types'
import { NextFunction, Router, Request, Response } from 'express'
import { createRoom, getRoom } from '../controller/room-controller'
import { StatusCodes } from 'http-status-codes'
import { verifyUser } from '../utils/verifyToken'

const router = Router()

async function requireLogin(req: Request, res: Response, next: NextFunction) {
  const userToken = req.headers.authorization
  if (!userToken || !userToken.startsWith('Bearer ')) {
    res.status(StatusCodes.UNAUTHORIZED).send()
    return
  }

  console.log('Verifying user token:', userToken)
  const user: ExtractedUser | null = await verifyUser(userToken.split('Bearer ')[1])
  if (user === null) {
    res.status(StatusCodes.UNAUTHORIZED).send()
    return
  }
  res.locals.user = user
  next()
}

const { SERVICE_API_KEY } = process.env
async function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers.authorization
  if (!SERVICE_API_KEY) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: 'Service API key not found',
    })
    return
  }

  if (
    !apiKey ||
    (!apiKey.startsWith('Bearer ') && apiKey.split('Bearer ')[1] !== SERVICE_API_KEY)
  ) {
    res.status(StatusCodes.UNAUTHORIZED).send()
    return
  }
  next()
}

router.get('/:roomId', requireLogin, async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId
    if (!roomId) {
      throw new Error('Room Id not found in request')
    }

    const roomData = await getRoom(roomId)

    res.json(userRoomCreatedDataSchema.safeParse(roomData))
  } catch (err) {
    console.error(err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('Error when getting room:\n' + err)
  }
})

router.post('/', requireApiKey, async (req: Request, res: Response) => {
  try {
    const userMatchDoneData = userMatchDoneDataSchema.safeParse(req.body).data
    if (!userMatchDoneData) {
      throw new Error('Invalid request body found when creating room')
    }

    const newRoomData = await createRoom(userMatchDoneData)

    res.json(userRoomCreatedDataSchema.safeParse(newRoomData))
  } catch (err) {
    console.error(err)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json("Error when creating room:\n' + err")
  }
})

export default router
