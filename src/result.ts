/**
 * `Result<T>` (sometimes known as `Either<T>`) is a generic type that is either
 * something of type `T` (in case of success), or of type `AppError` (in case of an error or failure).
 * see e.g. https://blog.logrocket.com/pattern-matching-and-type-safety-in-typescript-1da1231a2e34/
 */
export type Result<T> = AppError | T

export interface AppError {
  /** short English debug string */
  error: string;
}
