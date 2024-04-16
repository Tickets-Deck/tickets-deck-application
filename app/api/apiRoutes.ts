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
  static BASE_URL_TEST: string = "https://ticketsdeck.netlify.app";

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
   * The route to Users endpoint
   */
  static Users: string = "api/users";

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
   * The route to Dashboard endpoint
   */
  static Dashboard: string = "api/users/dashboard";
}
