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
  static BASE_URL_LIVE: string = "https://api.ticketsdeck.com/";

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
   * The route to User Signup Token endpoint
   */
  static UserSignup: string = "auth/register";

  /**
   * The route to OAuth Token Verification endpoint
   */
  static VerifyOAuthToken: string = "auth/verify-oauth-token";

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
   * The route to FetchPastEvents endpoint
   */
  static FetchPastEvents: `/events/past`;

  /**
   * The route to Fetch Event Information endpoint for the publisher's use only
   */
  static FetchOrganizerEvent: (eventId: string) => string = (eventId: string) =>
    `events/${eventId}/publisher`;

  /**
   * The route to Fetch Organizer Events endpoint
   */
  static FetchOrganizerEvents: (organizerId: string) => string = (
    organizerId: string
  ) => `events/organizer/${organizerId}`;

  /**
   * The route to Fetch Events By Publisher Id endpoint
   */
  static FetchEventsByPublisherId: (publisherId: string) => string = (
    publisherId: string
  ) => `events/publisher/${publisherId}`;

  /**
   * The route to FetchOrderInformation endpoint
   */
  static FetchOrderInformation: (orderId: string) => string = (
    orderId: string
  ) => `orders/${orderId}/tickets`;

  /**
   * The route to Check-in an order
   */
  static CheckInTicketOrder: (
    ticketOrderAccessCode: string,
    eventId: string
  ) => string = (ticketOrderAccessCode: string, eventId: string) =>
    `events/${eventId}/check-in/${ticketOrderAccessCode}`;

  /**
   * The route to Check-in multiple orders
   */
  static CheckInMultipleTicketOrder: (
    ticketOrderAccessCode: string,
    eventId: string
  ) => string = (ticketOrderAccessCode: string, eventId: string) =>
    `events/${eventId}/check-in-multiple/${ticketOrderAccessCode}`;

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
   * The route to Fetch User By Username
   */
  static FetchUserByUsername: (username: string) => string = (
    username: string
  ) => `users/username/${username}`;

  /**
   * The route to VerifyUserEmail endpoint
   */
  static VerifyUserEmail: (userId: string) => string = (userId: string) =>
    `auth/verify-email/${userId}`;

  /**
   * The route to VerifyUserEmail endpoint
   */
  static ResendVerificationEmail: (userId: string) => string = (userId: string) =>
    `auth/resend-verification-email/${userId}`;

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
   * The route to Tickets Sold endpoint
   */
  static FetchTicketsSold: (publisherId: string) => string = (
    publisherId: string
  ) => `users/${publisherId}/sold-tickets`;

  /**
   * The route to Tickets endpoint
   */
  static Tickets: string = "tickets";

  /**
   * The route to FetchEventTickets endpoint
   */
  static FetchEventTickets: (eventId: string) => string = (eventId: string) =>
    `events/${eventId}/tickets`;

  /**
   * The route to UpdateTicket endpoint
   */
  static UpdateTicket: (ticketId: string) => string = (ticketId: string) =>
    `tickets/${ticketId}`;

  /**
   * The route to DeleteTicket endpoint
   */
  static DeleteTicket: (ticketId: string) => string = (ticketId: string) =>
    `tickets/${ticketId}`;

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
  static UserPasswordResetLink: string = "auth/request-password-reset-link";

  /**
   * The route to User Password Reset endpoint
   */
  static UserPasswordReset: string = "auth/reset-password";

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

  /**
   * The route to RecordEventView endpoint
   */
  static RecordEventView: (eventId: string, userId?: string) => string = (
    eventId: string,
    userId?: string
  ) => `events/${eventId}/record-view${userId ? `?userId=${userId}` : ""}`;

  /**
   * The route to FetchEventViewsAnalytics endpoint
   */
  static FetchEventViewsAnalytics: (eventId: string) => string = (
    eventId: string
  ) => `events/${eventId}/views-analytics`;

  /**
   * The route to FetchEventViewsCount endpoint
   */
  static FetchEventViewsCount: (eventId: string) => string = (
    eventId: string
  ) => `events/${eventId}/views`;

  /**
   * The route to TrendingEventCategories endpoint
   */
  static TrendingEventCategories: string = "event-category/trending";
}
