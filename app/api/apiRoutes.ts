/**
 * The API routes endpoints
 */
export class ApiRoutes {
  /**
   * The dev base url for the application
   */
  static BASE_URL_DEV: string = "http://localhost:9000";
  //   static BASE_URL_DEV: string = "http://192.168.1.226:9000/";

  /**
   * The test base url for the application
   */
  static BASE_URL_TEST: string = "https://apitest.ticketsdeck.com/";

  /**
   * The live base url for the application
   */
  static BASE_URL_LIVE: string = "https://events.ticketsdeck.com";

  /**
   * The base url being used for the application
   */
  static BASE_URL: string = ApiRoutes.BASE_URL_TEST;

  /**
   * The route to Request Credential Token endpoint
   */
  static RequestCredentialToken: string = "auth/request-token";

  /**
   * The route to CreateNewsletterSubscriber endpoint
   */
  static CreateNewsletterSubscriber: string = "newsletter/signup";

  /**
   * The route to Customer Enquiries endpoint
   */
  static CustomerEnquiries: string = "enquiries";

  /**
   * The route to Events endpoint
   */
  static Events: string = "events";

  /**
   * The route to Orders endpoint
   */
  static Orders: string = "api/events/orders";

  /**
   * The route to Check-in an order
   */
  static CheckInTicketOrder: string = "api/events/check-in";

  /**
   * The route to Check-in multiple orders
   */
  static CheckInMultipleTicketOrder: string = "api/events/check-in/multiple";

  /**
   * The route to Users endpoint
   */
  static Users: string = "api/users";

  /**
   * The route to VerifyUserEmail endpoint
   */
  static VerifyUserEmail: string = "api/users/verify";

  /**
   * The route to UploadUserProfilePhoto endpoint
   */
  static UploadUserProfilePhoto: string = "api/users/profile-photo";

  /**
   * The route to UpdateUserCoverPhoto endpoint
   */
  static UpdateUserCoverPhoto: string = "api/users/cover-photo";

  /**
   * The route to UpdateUserName endpoint
   */
  static UpdateUserName: string = "api/users/username";

  /**
   * The route to TicketOrder endpoint
   */
  static TicketOrder: string = "api/events/tickets/order";

  /**
   * The route to User TicketOrder endpoint
   */
  static UserTicketOrder: string = "api/users/tickets";

  /**
   * The route to Payment endpoint
   */
  static Payment: string = "api/events/tickets/payment";

  /**
   * The route to Tickets endpoint
   */
  static Tickets: string = "api/events/tickets";

  /**
   * The route to Dashboard endpoint
   */
  static Dashboard: string = "api/users/dashboard";

  /**
   * The route to Follows endpoint
   */
  static Follows: string = "api/users/follows";

  /**
   * The route to User Recent Transactions endpoint
   */
  static UserRecentTransactions: string = "api/users/recent-transactions";

  /**
   * The route to Like Event endpoint
   */
  static LikeEvent: string = "api/events/like";

  /**
   * The route to Request User Password Reset Link endpoint
   */
  static UserPasswordResetLink: string =
    "api/users/password/request-reset-link";

  /**
   * The route to User Password Reset endpoint
   */
  static UserPasswordReset: string = "api/users/password/reset";

  /**
   * The route to User Password Change endpoint
   */
  static UserPasswordChange: string = "api/users/password/change";

  /**
   * The route to User Wallet Balance endpoint
   */
  static UserWalletBalance: string = "api/users/wallet-balance";

  /**
   * The route to User Favorite Events endpoint
   */
  static UserFavoriteEvents: string = "api/events/favourites";

  /**
   * The route to Featured Events endpoint
   */
  static FeaturedEvents: string = "events/featured";

  /**
   * The route to Fetch all Banks endpoint
   */
  static FetchAllBanks: string = "api/paystack/banks";

  /**
   * The route to Fetch Bank Details endpoint
   */
  static FetchBankDetails: string = "api/paystack/validate-bank-account";

  /**
   * The route to User Bank Account endpoint
   */
  static UserBankAccount: string = "api/users/bank-account";

  /**
   * The route to Transaction Fee endpoint
   */
  static TransactionFee: (eventId: string) => string = (eventId: string) => `transaction-fees/event/${eventId}`;

  /**
   * The route to Verify Coupon Code endpoint
   */
  static VerifyCouponCode: string = "api/verify-coupon";
}
