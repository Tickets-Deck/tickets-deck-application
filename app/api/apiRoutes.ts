/**
 * The API routes endpoints
 */
export class ApiRoutes {
  /**
   * The dev base url for the application
   */
  static BASE_URL_DEV: string = "http://localhost:9000/";
  //   static BASE_URL_DEV: string = "http://192.168.1.226:9000/";

  /**
   * The test base url for the application
   */
  static BASE_URL_TEST: string = "https://beta.events.ticketsdeck.com";

  /**
   * The live base url for the application
   */
  static BASE_URL_LIVE: string = "https://events.ticketsdeck.com";

  /**
   * The route to CreateNewsletterSubscriber endpoint
   */
  static CreateNewsletterSubscriber: string = "api/newsletter-subscriber";

  /**
   * The route to Events endpoint
   */
  static Events: string = "api/events";

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
   * The route to Tickets Sold Metrics endpoint
   */
  static TicketsSoldMetrics: string =
    "api/users/dashboard/sold-tickets-metrics";

  /**
   * The route to Follows endpoint
   */
  static Follows: string = "api/users/follows";

  /**
   * The route to Customer Enquiries endpoint
   */
  static CustomerEnquiries: string = "api/customer-enquiries";

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
   * The route to User Wallet endpoint
   */
  static UserWallet: string = "api/users/wallet";

  /**
   * The route to User Payouts endpoint
   */
  static UserPayout: string = "api/users/wallet/payout";

  /**
   * The route to User Favorite Events endpoint
   */
  static UserFavoriteEvents: string = "api/events/favourites";

  /**
   * The route to Featured Events endpoint
   */
  static FeaturedEvents: string = "api/events/featured";

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
  static TransactionFee: string = "api/transaction-fees";

  /**
   * The route to Verify Coupon Code endpoint
   */
  static VerifyCouponCode: string = "api/verify-coupon";
}
