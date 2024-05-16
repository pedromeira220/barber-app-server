import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { NoPermissionError } from '../errors/api-error'
import { env } from '../../env'

export function checkToken(req: Request, res: Response, next: NextFunction) {
  const JWT_SECRET = env.JWT_SECRET

  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    throw new NoPermissionError('Access denied')
  }

  try {
    const secret = JWT_SECRET

    const jwtPayload: any = jwt.verify(token, secret)

    const barbershopId = jwtPayload.id

    //Adding the user id and the email to the request object, this values will be used later

    // @ts-ignore to ignore the type checking errors on the next line
    req.barbershopId = barbershopId

    next()
  } catch (error) {
    console.error(error)

    throw new NoPermissionError('Invalid token', 'invalid-token')
  }
}
