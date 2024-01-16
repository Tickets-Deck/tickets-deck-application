/**
 * The API routes endpoints
 */
export class ApiRoutes {
  /**
   * The dev base url for the application
   */
  static BASE_URL_DEV: string = "http://localhost:9000/";

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
   * The route to Users endpoint
   */
  static Users: string = "api/users";

  /**
   * The route to UploadUserProfilePhoto endpoint
   */
  static UploadUserProfilePhoto: string = "api/users/profile-photo";

  /**
   * The route to UpdateUserName endpoint
   */
  static UpdateUserName: string = "api/users/username";
}
