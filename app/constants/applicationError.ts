import { StatusCodes } from "../models/IStatusCodes";

interface IApplicationError {
  Text: string;
  Code: string;
}

export class BaseApplicationError {
  /**
   * Internal server error
   */
  static InternalServerError: IApplicationError = {
    Text: "Internal server error",
    Code: `${StatusCodes.InternalServerError}`,
  };

  /**
   * The error message for ~ Method not allowed
   */
  static MethodNotAllowed: IApplicationError = {
    Text: "Method Not Allowed",
    Code: `${StatusCodes.MethodNotAllowed}`,
  };

  /**
   * The error message for ~ Missing Required Parameters
   */
  static MissingRequiredParameters: IApplicationError = {
    Text: "Missing Required Parameters",
    Code: `${StatusCodes.BadRequest}`,
  };
}

/**
 * The ApplicationError class
 */
export class ApplicationError extends BaseApplicationError {
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
   * The error message for ~ User already exists
   */
  static UserAlreadyExists: IApplicationError = {
    Text: "User already exists",
    Code: "USER_1004",
  };

  /**
   * The error message for ~ User ID is required
   */
  static UserIdIsRequired: IApplicationError = {
    Text: "User ID is required",
    Code: "USER_1005",
  };

  /**
   * The error message for ~ User with specified email already exists
   */
  static UserWithEmailAlreadyExists: IApplicationError = {
    Text: "User with specified email already exists",
    Code: "USER_1006",
  };

  /**
   * The error message for ~ Username is required
   */
  static UsernameIsRequired: IApplicationError = {
    Text: "Username is required",
    Code: "USER_1007",
  };

  /**
   * The error message for ~ User with specified username already exists
   */
  static UserWithUsernameAlreadyExists: IApplicationError = {
    Text: "User with specified username already exists",
    Code: "USER_1008",
  };

  /**
   * The error message for ~ Failed to fetch users
   */
  static FailedToFetchUsers: IApplicationError = {
    Text: "Failed to fetch users",
    Code: "USER_1009",
  };

  /**
   * The error message for ~ Failed to fetch user
   */
  static FailedToFetchUser: IApplicationError = {
    Text: "Failed to fetch user",
    Code: "USER_1010",
  };

  /**
   * The error message for ~ Failed to create user
   */
  static FailedToCreateUser: IApplicationError = {
    Text: "Failed to create user",
    Code: "USER_1011",
  };

  /**
   * The error message for ~ Failed to update user
   */
  static FailedToUpdateUser: IApplicationError = {
    Text: "Failed to update user",
    Code: "USER_1012",
  };

  /**
   * The error message for ~ Failed to update username
   */
  static FailedToUpdateUsername: IApplicationError = {
    Text: "Failed to update username",
    Code: "USER_1013",
  };

  /**
   * The error message for ~ Failed to fetch user dashboard data
   */
  static FailedToFetchUserDashboardData: IApplicationError = {
    Text: "Failed to fetch user dashboard data",
    Code: "USER_1014",
  };

  /**
   * The error message for ~ User email is required
   */
  static UserEmailIsRequired: IApplicationError = {
    Text: "User email is required",
    Code: "USER_1015",
  };

  /**
   * The error message for ~ User email is not valid
   */
  static UserEmailIsNotValid: IApplicationError = {
    Text: "User email is not valid",
    Code: "USER_1016",
  };

  /**
   * The error message for ~ User signed up with third party social media
   */
  static UserSignedUpWithSocialMedia: IApplicationError = {
    Text: "User signed up with third party social media",
    Code: "USER_1017",
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

  //#region Token Errors

  /**
   * The error message for ~ Token is required
   */
  static TokenIsRequired: IApplicationError = {
    Text: "Token is required",
    Code: "TOKEN_1000",
  };

  /**
   * The error message for ~ Verification token not set
   */
  static VerificationTokenNotSet: IApplicationError = {
    Text: "Verification token not set",
    Code: "TOKEN_1001",
  };

  /**
   * The error message for ~ Verification token is expired
   */
  static TokenExpired: IApplicationError = {
    Text: "Verification token is expired",
    Code: "TOKEN_1002",
  };

  //#endregion

  //#region Ticket Errors

  /**
   * The error message for ~ Ticket category is required
   */
  static TicketCategoryIsRequired: IApplicationError = {
    Text: "Ticket category is required",
    Code: "TICKET_1000",
  };

  /**
   * The error message for ~ Invalid Ticket category
   */
  static InvalidTicketCategory: IApplicationError = {
    Text: "Invalid Ticket category",
    Code: "TICKET_1001",
  };

  /**
   * The error message for ~ Failed to fetch tickets
   */
  static FailedToFetchTickets: IApplicationError = {
    Text: "Failed to fetch tickets",
    Code: "TICKET_1002",
  };

  /**
   * The error message for ~ Ticket with specified Ticket ID not found
   */
  static TicketWithIdNotFound: IApplicationError = {
    Text: "Ticket with specified Ticket ID not found",
    Code: "TICKET_1003",
  };

  /**
   * The error message for ~ Ticket ID is required
   */
  static TicketIdIsRequired: IApplicationError = {
    Text: "Ticket ID is required",
    Code: "TICKET_1004",
  };

  //#endregion

  //#region Ticket order Errors

  /**
   * The error message for ~ Ticket order with specified Ticket Order ID not found
   */
  static TicketOrderWithIdNotFound: IApplicationError = {
    Text: "Ticket order with specified Ticket Order ID not found",
    Code: "TICKET_ORDER_1000",
  };

  /**
   * The error message for ~ Ticket order ID is required
   */
  static TicketOrderIdIsRequired: IApplicationError = {
    Text: "Ticket order ID is required",
    Code: "TICKET_ORDER_1001",
  };

  /**
   * The error message for ~ Ticket order has been processed
   */
  static TicketOrderHasBeenProcessed: IApplicationError = {
    Text: "Ticket order has been processed",
    Code: "TICKET_ORDER_1002",
  };

  //#endregion

  //#region Profile Errors

  /**
   * The error message for ~ Profile photo is required
   */
  static ProfilePhotoIsRequired: IApplicationError = {
    Text: "Profile photo is required",
    Code: "PROFILE_1000",
  };

  /**
   * The error message for ~ Failed to upload profile photo
   */
  static FailedToUploadProfilePhoto: IApplicationError = {
    Text: "Failed to upload profile photo",
    Code: "PROFILE_1001",
  };

  /**
   * The error message for ~ Cover photo is required
   */
  static CoverPhotoIsRequired: IApplicationError = {
    Text: "Cover photo is required",
    Code: "PROFILE_1002",
  };

  /**
   * The error message for ~ Failed to upload cover photo
   */
  static FailedToUploadCoverPhoto: IApplicationError = {
    Text: "Failed to upload cover photo",
    Code: "PROFILE_1003",
  };

  //#endregion

  //#region Verification Errors

  /**
   * The error message for ~ Failed to resend verification email
   */
  static FailedToResendVerificationEmail: IApplicationError = {
    Text: "Failed to resend verification email",
    Code: "VERIFICATION_1000",
  };

  /**
   * The error message for ~ Failed to verify email
   */
  static FailedToVerifyEmail: IApplicationError = {
    Text: "Failed to verify email",
    Code: "VERIFICATION_1001",
  };

  //#endregion

  //#region Follow Action Errors

  /**
   * The error message for ~ User cannot follow or unfollow themselves
   */
  static UserCannotFollowOrUnfollowThemselves: IApplicationError = {
    Text: "User cannot follow or unfollow themselves",
    Code: "FOLLOW_1000",
  };

  /**
   * The error message for ~ FollowerId is required
   */
  static FollowerIdIsRequired: IApplicationError = {
    Text: "FollowerId is required",
    Code: "FOLLOW_1001",
  };

  /**
   * The error message for ~ FolloweeId is required
   */
  static FolloweeIdIsRequired: IApplicationError = {
    Text: "FolloweeId is required",
    Code: "FOLLOW_1002",
  };

  /**
   * The error message for ~ Follower with specified Follower ID not found
   */
  static FollowerWithIdNotFound: IApplicationError = {
    Text: "Follower with specified Follower ID not found",
    Code: "FOLLOW_1003",
  };

  /**
   * The error message for ~ Followee with specified Followee ID not found
   */
  static FolloweeWithIdNotFound: IApplicationError = {
    Text: "Followee with specified Followee ID not found",
    Code: "FOLLOW_1004",
  };

  /**
   * The error message for ~ Failed to fetch follow actions
   */
  static FailedToFetchFollowActions: IApplicationError = {
    Text: "Failed to fetch follow actions",
    Code: "FOLLOW_1005",
  };

  /**
   * The error message for ~ Follower with specified Follower ID already follows the Followee with specified Followee ID
   */
  static FollowerAlreadyFollowsFollowee: IApplicationError = {
    Text: "Follower with specified Follower ID already follows the Followee with specified Followee ID",
    Code: "FOLLOW_1006",
  };

  /**
   * The error message for ~ Follower with specified Follower ID does not follow the Followee with specified Followee ID
   */
  static FollowerDoesNotFollowFollowee: IApplicationError = {
    Text: "Follower with specified Follower ID does not follow the Followee with specified Followee ID",
    Code: "FOLLOW_1007",
  };

  /**
   * The error message for ~ Failed to perform action
   */
  static FailedToPerformSocialAction: IApplicationError = {
    Text: "Failed to perform social action",
    Code: "FOLLOW_1008",
  };

  /**
   * The error message for ~ Invalid action type
   */
  static InvalidActionType: IApplicationError = {
    Text: "Invalid action type",
    Code: "FOLLOW_1009",
  };

  //#endregion

  //#region Newsletter Errors

  /**
   * The error message for ~ Failed to subscribe to newsletter
   */
  static FailedToSubscribeToNewsletter: IApplicationError = {
    Text: "Failed to subscribe to newsletter",
    Code: "NEWSLETTER_1000",
  };

  //#endregion

  //#region Event Errors

  /**
   * The error message for ~ Event with specified Event ID not found
   */
  static EventWithIdNotFound: IApplicationError = {
    Text: "Event with specified Event ID not found",
    Code: "EVENT_1000",
  };

  /**
   * The error message for ~ Event ID is required
   */
  static EventIdIsRequired: IApplicationError = {
    Text: "Event ID is required",
    Code: "EVENT_1001",
  };

  /**
   * The error message for ~ Event's publisher ID is required
   */
  static EventPublisherIdIsRequired: IApplicationError = {
    Text: "Event's publisher ID is required",
    Code: "EVENT_1002",
  };

  /**
   * The error message for ~ Event with specified eventId already exists
   */
  static EventWithIdAlreadyExists: IApplicationError = {
    Text: "Event with specified eventId already exists",
    Code: "EVENT_1003",
  };

  /**
   * The error message for ~ No Event with the specified Tags found
   */
  static NoEventWithSpecifiedTagsFound: IApplicationError = {
    Text: "No Event with the specified Tags found",
    Code: "EVENT_1004",
  };

  /**
   * The error message for ~ Event's eventId is required
   */
  static EventEventIdIsRequired: IApplicationError = {
    Text: "Event's eventId is required",
    Code: "EVENT_1005",
  };

  //#endregion

  //#region Payment Errors

  /**
   * The error message for ~ Payment initialization failed
   */
  static PaymentInitializationFailed: IApplicationError = {
    Text: "Payment initialization failed",
    Code: "PAYMENT_1000",
  };

  /**
   * The error message for ~ Transaction reference is required
   */
  static TransactionReferenceIsRequired: IApplicationError = {
    Text: "Transaction reference is required",
    Code: "PAYMENT_1001",
  };

  //#endregion

  //#region Password Errors

  /**
   * The error message for ~ Password is required
   */
  static PasswordIsRequired: IApplicationError = {
    Text: "Password is required",
    Code: "PASSWORD_1000",
  };

  /**
   * The error message for ~ Password is not valid
   */
  static PasswordIsNotValid: IApplicationError = {
    Text: "Password is not valid",
    Code: "PASSWORD_1001",
  };

  /**
   * The error message for ~ Passwords do not match
   */
  static PasswordsDoNotMatch: IApplicationError = {
    Text: "Passwords do not match",
    Code: "PASSWORD_1002",
  };

  /**
   * The error message for ~ Failed to send password reset email
   */
  static FailedToSendPasswordResetEmail: IApplicationError = {
    Text: "Failed to send password reset email",
    Code: "PASSWORD_1003",
  };

  /**
   * The error message for ~ Password reset token has expired
   */
  static PasswordResetTokenExpired: IApplicationError = {
    Text: "Password reset token has expired",
    Code: "PASSWORD_1004",
  };

  /**
   * The error message for ~ Password is the same as the old password
   */
  static PasswordSameAsOld: IApplicationError = {
    Text: "Password is the same as the old password",
    Code: "PASSWORD_1005",
  };

  //#endregion
}
