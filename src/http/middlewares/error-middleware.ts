import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { ApiError } from '../errors/api-error'
// import { BaseError } from '../helpers/apiError'

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("> Error", error)

  if(error instanceof ZodError) {

    return res.status(400).json({
      message: 'Error during validation',
      errors: error.flatten().fieldErrors,
      code: "validation-error"
    })
  }

  if(error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
      code: error.code  
    })
  }

  return res
    .status(500)
    .json({       
      message: error.message ?? "Internal Server Error",
      code: "error"  
    })
}
