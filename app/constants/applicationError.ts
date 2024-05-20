interface IApplicationError {
  Text: string;
  Code: string;
}

/**
 * The ApplicationError class
 */
export class ApplicationError {
  //#region User Errors

  /**
   * The error message for ~ User with specified User ID not found
   */
  static UserWithIdNotFound: IApplicationError = {
    Text: "User with specified User ID not found",
    Code: "USER_1000",
  };

  /**
   * The error message for ~ User with specified username not found
   */
  static UserWithUsernameNotFound: IApplicationError = {
    Text: "User with specified username not found",
    Code: "USER_1001",
  };

  /**
   * The error message for ~ User with specified token not found
   */
  static UserWithTokenNotFound: IApplicationError = {
    Text: "User with specified token not found",
    Code: "USER_1002",
  };

  /**
   * The error message for ~ User with specified email not found
   */
  static UserWithEmailNotFound: IApplicationError = {
    Text: "User with specified email not found",
    Code: "USER_1003",
  };

  /**
   * The error message for ~ User with specified email already exists
   */
    static UserAlreadyExists: IApplicationError = {
        Text: "User already exists",
        Code: "USER_1004",
    };

  //#endregion

  //#region Email Errors

  /**
   * The error message for ~ Email is already verified
   */
  static EmailAlreadyVerified: IApplicationError = {
    Text: "Email is already verified",
    Code: "EMAIL_1000",
  };

  /**
   * The error message for ~ Email is required
   */
  static EmailIsRequired: IApplicationError = {
    Text: "Email is required",
    Code: "EMAIL_1001",
  };

  //#endregion

  /**
   * The error message for ~ Token is required
   */
  static TokenIsRequired: IApplicationError = {
    Text: "Token is required",
    Code: "TOKEN_1000",
  };
}
