export class ApiError extends Error {
  private readonly _statusCode: number

  get statusCode() {
    return this._statusCode
  }

  constructor(message: string, statusCode: number) {
    super(message)
    this._statusCode = statusCode
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404)
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, 401)
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string) {
    super(message, 500)
  }
}