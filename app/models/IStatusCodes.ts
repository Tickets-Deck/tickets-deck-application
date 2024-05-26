/**
 * Enum representing status codes for the API.
 */
export enum StatusCodes {
  /**
   * The request was successful.
   */
  Success = 200,

  /**
   * The request was successful and a new resource was created.
   */
  Created = 201,

  /**
   * The request was successful and there was no content to return.
   */
  NoContent = 204,

  /**
   * The request was successful and the resource was deleted.
   */
  Deleted = 204,

  /**
   * The request is malformed or invalid.
   */
  BadRequest = 400,

  /**
   * The request requires user authentication.
   */
  Unauthorized = 401,

  /**
   * The user does not have permission to access the requested resource.
   */
  Forbidden = 403,

  /**
   * The requested resource could not be found.
   */
  NotFound = 404,

  /**
   * The request method is not allowed.
   */
  MethodNotAllowed = 405,

  /**
   * The request could not be completed due to a conflict with the current state of the resource.
   */
  Conflict = 409,

  /**
   * An internal server error occurred.
   */
  InternalServerError = 500,
}
