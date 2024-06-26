export class ApiError extends Error {
  private readonly _statusCode: number
  private readonly _code: string

  get statusCode() {
    return this._statusCode
  }

  get code() {
    return this._code
  }

  constructor(message: string, statusCode: number, code?: string) {
    super(message)
    this._statusCode = statusCode

    if(code) {
      this._code = code
    } else {
      this._code = "error"
    }
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, code?: string) {
    super(message, 400, code)
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string, code?: string) {
    super(message, 404, code)
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string, code?: string) {
    super(message, 401, code)
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string, code?: string) {
    super(message, 500, code)
  }
}

export class NoPermissionError extends ApiError {
  constructor(message: string, code?: string) {
    super(message, 401, code)
  }
}
