import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
// import { BaseError } from '../helpers/apiError'

export function errorMiddleware(
  error: Error, // & Partial<BaseError>,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("> Error", error)

  if(error instanceof ZodError) {
    error.format()

    return res
    .status(400)
    .json(error.format())
  }

  const statusCode = /* error.statusCode ?? */ 500
  /* const message = /* error.statusCode ?  error.message : 'Internal Server Error' */
  const codeError = /* error.codeError ? error.codeError :  */'error'
  return res
    .status(statusCode)
    .json({ error: true, msg: error.message, code: codeError })
}
