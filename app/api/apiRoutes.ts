/**
 * The API routes endpoints
 */
export class ApiRoutes {
  /**
   * The dev base url for the application
   */
  static BASE_URL_DEV: string = "http://localhost:3050/";
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
  static BASE_URL: string = ApiRoutes.BASE_URL_DEV;

  /**
   * The route to Request Credential Token endpoint
   */
  static RequestCredentialToken: string = "auth/request-token";

  /**
   * The route to Refresh Token endpoint
   */
  static RefreshToken: string = "auth/refresh-token";

  /**
   * The route to User Login Token endpoint
   */
  static UserLogin: string = "auth/login";

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
   * The route to Fetch Organizer Events endpoint
   */
  static FetchOrganizerEvents: (organizerId: string) => string = (
    organizerId: string
  ) => `events/organizer/${organizerId}`;

  /**
   * The route to FetchOrderInformation endpoint
   */
  static FetchOrderInformation: (orderId: string) => string = (
    orderId: string
  ) => `orders/${orderId}/tickets`;

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
   * The route to Update User Profile Information endpoint
   */
  static UpdateUserProfileInformation: (userId: string) => string = (
    userId: string
  ) => `users/profile/${userId}`;

  /**
   * The route to Fetch User Information endpoint
   */
  static FetchUserInformation: (userId: string) => string = (userId: string) =>
    `users/id/${userId}`;

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
  static UpdateUserName: (userId: string) => string = (userId: string) =>
    `users/username/${userId}`;

  /**
   * The route to TicketOrder endpoint
   */
  static InitializeTicketOrder: string = "orders/event/initialize";

  /**
   * The route to User TicketOrder endpoint
   */
  static UserTicketOrder: string = "api/users/tickets";

  /**
   * The route to Intialize Payment endpoint
   */
  static InitializePayment: string = "payments/process";

  /**
   * The route to Verify Payment endpoint
   */
  static VerifyPayment: (reference: string) => string = (reference: string) =>
    `payments/verify/${reference}`;

  /**
   * The route to Tickets Bought endpoint
   */
  static FetchTicketsBought: (userId: string) => string = (userId: string) =>
    `users/${userId}/bought-tickets`;

  /**
   * The route to Tickets endpoint
   */
  static Tickets: string = "api/events/tickets";

  /**
   * The route to Fetch Dashboard Information endpoint
   */
  static FetchDashboardInformation: (userId: string) => string = (
    userId: string
  ) => `dashboard/user/${userId}`;

  /**
   * The route to Follows endpoint
   */
  static Follows: string = "api/users/follows";

  /**
   * The route to User Recent Transactions endpoint
   */
  static UserRecentTransactions: (userId: string, duration?: number) => string =
    (userId: string, duration?: number) =>
      `users/${userId}/recent-transactions?duration=${duration}`;

  /**
   * The route to Event Like Status endpoint
   */
  static EventLikeStatus: (eventId: string) => string = (eventId: string) =>
    `events/${eventId}/is-liked`;

  /**
   * The route to Like Event endpoint
   */
  static LikeEvent: (eventId: string, userId: string) => string = (
    eventId: string,
    userId: string
  ) => `events/${eventId}/like/${userId}`;

  /**
   * The route to Unlike Event endpoint
   */
  static UnlikeEvent: (eventId: string, userId: string) => string = (
    eventId: string,
    userId: string
  ) => `events/${eventId}/unlike/${userId}`;

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
  static UserFavoriteEvents: (userId: string) => string = (userId: string) =>
    `events/${userId}/liked-events`;

  /**
   * The route to Featured Events endpoint
   */
  static FeaturedEvents: string = "events/featured";

  /**
   * The route to Fetch all Banks endpoint
   */
  static FetchAllBanks: string = "banks";

  /**
   * The route to Fetch Bank Details endpoint
   */
  static FetchBankDetails: (bankCode: string, accountNumber: string) => string =
    (bankCode: string, accountNumber: string) =>
      `banks/${bankCode}/details/${accountNumber}`;

  /**
   * The route to User Bank Account endpoint
   */
  static UserBankAccount: (userId: string) => string = (userId: string) =>
    `banks/${userId}/bank-account`;

  /**
   * The route to Transaction Fee endpoint
   */
  static TransactionFee: (eventId: string) => string = (eventId: string) =>
    `transaction-fees/event/${eventId}`;

  /**
   * The route to Verify Coupon Code endpoint
   */
  static VerifyCouponCode: string = "api/verify-coupon";

  /**
   * The route to EventCategory endpoint
   */
  static EventCategory: string = "event-category";
}
