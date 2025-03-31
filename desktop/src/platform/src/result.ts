export type Result<T> = ResultValue<T> | ResultError

export type ResultValue<T> = {
  ok: true
  val: T
  err?: never
}

export type ResultError = {
  ok: false
  val?: never
  err: string
  code?: string
}

export const Return = {
  Value<T>(val: T): ResultValue<T> {
    return { ok: true, val }
  },
  Failed(err: string, code?: string): ResultError {
    return { ok: false, err, code }
  },
}

export function isError(err: unknown): err is Error {
  return err instanceof Error
}

export const ErrorTypeUnauthorized = "unauthorized"
export const ErrorTypeForbidden = "forbidden"
export const ErrorTypeNotFound = "not_found"
export const ErrorTypeAlreadyExists = "already_exists"
export const ErrorTypeInvalid = "invalid"
export const ErrorTypeNetwork = "network"
export const ErrorTypeServiceUnavailable = "service_unavailable"
export const ErrorTypeTimeout = "timeout"
export const ErrorTypeUnknown = "unknown"

export function MapErrorCode(statusCode: number): string {
  switch (statusCode) {
    case 401:
      return ErrorTypeUnauthorized
    case 403:
      return ErrorTypeForbidden
    case 404:
      return ErrorTypeNotFound
    case 409:
      return ErrorTypeAlreadyExists
    case 422:
      return ErrorTypeInvalid
    case 503:
      return ErrorTypeServiceUnavailable
    case 504:
      return ErrorTypeTimeout
    default:
      return ErrorTypeUnknown
  }
}
