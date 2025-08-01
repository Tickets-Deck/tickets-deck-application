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
  static BASE_URL: string = ApiRoutes.BASE_URL_LIVE;

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
  static FetchPastEvents: string = `/events/past`;

  /**
   * The route to Fetch Event Information endpoint for the publisher's use only
   */
  static FetchOrganizerEvent: (eventId: string, publisherId: string) => string =
    (eventId: string, publisherId: string) =>
      `events/${eventId}/publisher/${publisherId}`;

  /**
   * The route to Fetch Previous Event Analytics endpoint
   */
  static FetchPreviousEventAnalytics: (eventId: string) => string = (
    eventId: string
  ) => `events/${eventId}/previous-analytics`;

  /**
   * The route to Fetch Events endpoint for the publisher's use only
   */
  static FetchOrganizerEvents: (publisherId: string) => string = (
    publisherId: string
  ) => `events/organizer/${publisherId}`;

  /**
   * The route to Create Organizer Review endpoint
   */
  static CreateReview: string = `reviews`;

  /**
   * The route to Fetch Organizer Reviews Id endpoint
   */
  static FetchOrganizerReviews: (organizerId: string) => string = (
    organizerId: string
  ) => `reviews/organizer/${organizerId}`;

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
  static ResendVerificationEmail: (userId: string) => string = (
    userId: string
  ) => `auth/resend-verification-email/${userId}`;

  /**
   * The route to UploadUserProfilePhoto endpoint
   */
  static UploadUserProfilePhoto: string = "users/profile-photo";

  /**
   * The route to UpdateUserCoverPhoto endpoint
   */
  static UpdateUserCoverPhoto: string = "users/cover-photo";

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
   * The route to Event Attendee Metrics endpoint
   */
  static EventAttendeeMetrics: (publisherId: string) => string = (
    publisherId: string
  ) => `dashboard/event-attendees/${publisherId}`;

  /**
   * The route to Tickets Sold Metrics endpoint
   */
  static TicketsSoldMetrics: (publisherId: string) => string = (
    publisherId: string
  ) => `dashboard/ticket-sold-metrics/${publisherId}`;

  /**
   * The route to User Event Tickets sold endpoint
   */
  static UserEventTicketsSold: (
    publisherId: string,
    eventId: string
  ) => string = (publisherId: string, eventId: string) =>
    `events/${eventId}/sold-tickets/${publisherId}`;

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
  static UpdateTicket: (ticketId: string, publisherId: string) => string = (
    ticketId: string,
    publisherId: string
  ) => `tickets/${ticketId}/publisher/${publisherId}`;

  static FetchDailyTicketSales: (
    eventId: string,
    publisherId: string
  ) => string = (eventId: string, publisherId: string) =>
    `/tickets/${eventId}/publisher/${publisherId}/daily-sales`;

  /**
   * The route to DeleteTicket endpoint
   */
  static DeleteTicket: (ticketId: string, publisherId: string) => string = (
    ticketId: string,
    publisherId: string
  ) => `tickets/${ticketId}/publisher/${publisherId}`;

  /**
   * The route to Fetch Dashboard Information endpoint
   */
  static FetchDashboardInformation: (userId: string) => string = (
    userId: string
  ) => `dashboard/user/${userId}`;

  /**
   * The route to Follow User endpoint
   */
  static FollowUser: (id: string, followingId: string) => string = (
    id: string,
    followingId: string
  ) => `users/${id}/follow/${followingId}`;

  /**
   * The route to Unfollow User endpoint
   */
  static UnfollowUser: (id: string, followingId: string) => string = (
    id: string,
    followingId: string
  ) => `users/${id}/unfollow/${followingId}`;

  /**
   * The route to get followers count for a user endpoint
   */
  static GetFollowersCount: (objectiveUserId: string, id?: string) => string = (
    objectiveUserId: string,
    id?: string
  ) => `users/${objectiveUserId}/followers/count/${id ?? ""}`;

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
  static UserPasswordChange: (userId: string) => string = (userId: string) =>
    `users/change-password/${userId}`;

  /**
   * The route to Fetch User Wallet Balance endpoint
   */
  static FetchWalletBalance: (publisherId: string) => string = (
    publisherId: string
  ) => `wallet/balance/${publisherId}`;

  /**
   * The route to Fetch User Witdrawals endpoint
   */
  static FetchUserPayouts: (publisherId: string) => string = (
    publisherId: string
  ) => `wallet/payouts/${publisherId}`;

  /**
   * The route to Fetch User Witdrawals endpoint
   */
  static InitiateUserWithdrawals: (publisherId: string) => string = (
    publisherId: string
  ) => `wallet/withdraw/${publisherId}`;

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
  static VerifyCouponCode: (eventId: string, couponCode: string) => string = (
    eventId: string,
    couponCode: string
  ) => `coupons/${eventId}/verify/${couponCode}`;

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

  /**
   * The route to Create Banner endpoint
   */
  static Banners: string = `banners`;

  /**
   * The route to fetch the current user's created banners
   */
  static MyBanners: string = `banners/my-banners`;

  /**
   * The route to fetch the current all created banners
   */
  static AllBanners: string = `banners`;

  /**
   * The route to Upload Banner Frame endpoint
   */
  static UploadBannerFrame: string = `banners/upload-frame`;

  /**
   * The route to generate a personalized DP
   */
  static GenerateDp: (bannerId: string, ownerId?: string) => string = (
    bannerId: string,
    ownerId?: string
  ) => `dps/generate/${bannerId}/user/${ownerId}`;

  /**
   * The route to fetch the current user's generated DPs
   */
  //   static MyDps: string = `dps/my-dps`;
  static MyDps: string = "dps/my-dps";

  /**
   * The route to record a view for a banner
   */
  //   static RecordBannerView: (bannerId: string) => string = (bannerId: string) =>
  //     `banners/${bannerId}/view`;

  static FetchUserEventsForBanner: string = "/events/organizer/for-banner";
}
