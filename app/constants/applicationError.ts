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

  /**
   * The error message for ~ Not Authorized
   */
  static Unauthorized: IApplicationError = {
    Text: "Not Authorized",
    Code: `${StatusCodes.Unauthorized}`,
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

  /**
   * The error message for ~ Failed to fetch user favourite events
   */
  static FailedToFetchUserFavouriteEvents: IApplicationError = {
    Text: "Failed to fetch user favourite events",
    Code: "USER_1018",
  };

  //#endregion

  //#region AdminUser Errors

  /**
   * The error message for ~ AdminUser with specified AdminUser ID not found
   */
  static AdminUserWithIdNotFound: IApplicationError = {
    Text: "AdminUser with specified AdminUser ID not found",
    Code: "ADMINUSER_1000",
  };

  /**
   * The error message for ~ AdminUser with specified username not found
   */
  static AdminUserWithUsernameNotFound: IApplicationError = {
    Text: "AdminUser with specified username not found",
    Code: "ADMINUSER_1001",
  };

  /**
   * The error message for ~ AdminUser with specified token not found
   */
  static AdminUserWithTokenNotFound: IApplicationError = {
    Text: "AdminUser with specified token not found",
    Code: "ADMINUSER_1002",
  };

  /**
   * The error message for ~ AdminUser with specified email not found
   */
  static AdminUserWithEmailNotFound: IApplicationError = {
    Text: "AdminUser with specified email not found",
    Code: "ADMINUSER_1003",
  };

  /**
   * The error message for ~ AdminUser already exists
   */
  static AdminUserAlreadyExists: IApplicationError = {
    Text: "AdminUser already exists",
    Code: "ADMINUSER_1004",
  };

  /**
   * The error message for ~ AdminUser ID is required
   */
  static AdminUserIdIsRequired: IApplicationError = {
    Text: "AdminUser ID is required",
    Code: "ADMINUSER_1005",
  };

  /**
   * The error message for ~ AdminUser with specified email already exists
   */
  static AdminUserWithEmailAlreadyExists: IApplicationError = {
    Text: "AdminUser with specified email already exists",
    Code: "ADMINUSER_1006",
  };

  /**
   * The error message for ~ AdminUsername is required
   */
  static AdminUsernameIsRequired: IApplicationError = {
    Text: "AdminUsername is required",
    Code: "ADMINUSER_1007",
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

  /**
   * The error message for ~ Failed to fetch ticket orders
   */
  static FailedToFetchTicketOrders: IApplicationError = {
    Text: "Failed to fetch ticket orders",
    Code: "TICKET_ORDER_1003",
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

  /**
   * The error message for ~ Failed to fetch events
   */
  static FailedToFetchEvents: IApplicationError = {
    Text: "Failed to fetch events",
    Code: "EVENT_1006",
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

  //#region Bank Errors

  /**
   * The error message for ~ Error getting bank list
   */
  static BankListError: IApplicationError = {
    Text: "Error getting bank list",
    Code: "BANK_1000",
  };

  /**
   * The error message for ~ Error validating bank details
   */
  static BankDetailsError: IApplicationError = {
    Text: "Error validating bank details",
    Code: "BANK_1001",
  };

  /**
   * The error message for ~ Failed to fetch banks
   */
  static FailedToFetchBanks: IApplicationError = {
    Text: "Failed to fetch banks",
    Code: "BANK_1002",
  };

  /**
   * The error message for ~ Failed to fetch user bank accounts
   */
  static FailedToFetchUserBankAccounts: IApplicationError = {
    Text: "Failed to fetch user bank accounts",
    Code: "BANK_1003",
  };

  /**
   * The error message for ~ Failed to create user bank account
   */
  static FailedToCreateUserBankAccount: IApplicationError = {
    Text: "Failed to create user bank account",
    Code: "BANK_1004",
  };

  //#endregion

  //#region Transaction Fee Errors

  /**
   * The error message for ~ Failed to create transaction fee
   */
  static FailedToCreateTransactionFee: IApplicationError = {
    Text: "Failed to create transaction fee",
    Code: "TRANSACTION_FEE_1000",
  };

  /**
   * The error message for ~ Failed to fetch transaction fees
   */
  static FailedToFetchTransactionFees: IApplicationError = {
    Text: "Failed to fetch transaction fees",
    Code: "TRANSACTION_FEE_1001",
  };

  /**
   * The error message for ~ Transaction fee with specified Transaction Fee ID not found
   */
  static TransactionFeeWithIdNotFound: IApplicationError = {
    Text: "Transaction fee with specified Transaction Fee ID not found",
    Code: "TRANSACTION_FEE_1002",
  };

  /**
   * The error message for ~ Failed to delete transaction fee
   */
  static FailedToDeleteTransactionFee: IApplicationError = {
    Text: "Failed to delete transaction fee",
    Code: "TRANSACTION_FEE_1003",
  };

  //#endregion

  //#region Coupon Code Errors

  /**
   * The error message for ~ Coupon code already exists
   */
  static CouponCodeAlreadyExists: IApplicationError = {
    Text: "Coupon code already exists",
    Code: "COUPON_CODE_1000",
  };

  /**
   * The error message for ~ Invalid coupon discount
   */
  static InvalidCouponDiscount: IApplicationError = {
    Text: "Invalid coupon discount",
    Code: "COUPON_CODE_1001",
  };

  /**
   * The error message for ~ Failed to fetch coupon codes
   */
  static FailedToFetchCouponCodes: IApplicationError = {
    Text: "Failed to fetch coupon codes",
    Code: "COUPON_CODE_1002",
  };

  /**
   * The error message for ~ Failed to create coupon code
   */
  static FailedToCreateCouponCode: IApplicationError = {
    Text: "Failed to create coupon code",
    Code: "COUPON_CODE_1003",
  };

  /**
   * The error message for ~ Invalid coupon valid until
   */
  static InvalidCouponExpirationDate: IApplicationError = {
    Text: "Invalid coupon expiration date",
    Code: "COUPON_CODE_1004",
  };

  /**
   * The error message for ~ Coupon code is too long
   */
  static CouponCodeTooLong: IApplicationError = {
    Text: "Coupon code is too long. Maximum length is 6 characters.",
    Code: "COUPON_CODE_1005",
  };

  /**
   * The error message for ~ Coupon code not found
   */
  static CouponCodeNotFound: IApplicationError = {
    Text: "Coupon code not found",
    Code: "COUPON_CODE_1006",
  };

  /**
   * The error message for ~ Failed to delete coupon code
   */
  static FailedToDeleteCouponCode: IApplicationError = {
    Text: "Failed to delete coupon code",
    Code: "COUPON_CODE_1007",
  };

  //#endregion
}
