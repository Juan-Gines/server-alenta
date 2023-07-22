export class CustomError extends Error {
  constructor (status, mess, ...params) {
    super(...params)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }
    this.name = 'error'
    this.status = status
    this.message = mess
  }
}
