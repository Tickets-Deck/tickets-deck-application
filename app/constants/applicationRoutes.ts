/**
 * Application routes
 */
export class ApplicationRoutes {
  /**
   * The route to the home page
   */
  static readonly Home = "/";

  /**
   * The route to the verify email page
   */
  static readonly VerifyEmail = "/auth/verify";

  /**
   * The route to the sign in page
   */
  static readonly SignIn = "/auth/signin";

  /**
   * The route to the sign in page with a redirect
   */
  static readonly SignInRedirect = "api/auth/signin?redirect=true";

  /**
   * The route to the sign up page
   */
  static readonly SignUp = "/auth/signup";

  /**
   * The route to the forgot password page
   */
  static readonly ForgotPassword = "/auth/forgot-password";

  /**
   * The route to the reset password page
   */
  static readonly ResetPassword = "/auth/reset-password";

  /**
   * The route to the general events page
   */
  static readonly GeneralEvents = "/events";

  /**
   * The route to the about page
   */
  static readonly About = "/about";

  /**
   * The route to the contact page
   */
  static readonly Contact = "/contact";

  /**
   * The route to the general event page
   */
  static readonly GeneralEvent = "/event/"; // Intentionally left without a closing slash to allow for dynamic event IDs

  /**
   * The route to the verify payment page
   */
  static readonly VerifyPayment = "/verify-payment";

  /**
   * The route to the order page
   */
  static readonly Order = "/order";

  /**
   * The route to the user dashboard page
   */
  static readonly Dashboard = "/app";

  /**
   * The route to the profile page
   */
  static readonly Profile = "/app/profile";

  /**
   * The route to the wallet page
   */
  static readonly Wallet = "/app/wallet";

  /**
   * The route to the transactions page
   */
  static readonly Transactions = "/app/transactions";

  /**
   * The route to the user events page
   */
  static readonly Events = "/app/events";

  /**
   * The route to a user event page
   */
  static readonly Event = "/app/event";

  /**
   * The route to user favourite events page
   */
  static readonly FavouriteEvents = "/app/favourite-events";

  /**
   * The route to the user event tickets page
   */
  static readonly EventTickets = "/app/tickets";

  /**
   * The route to the create event page
   */
  static readonly CreateEvent = "/app/event/create";

  /**
   * The route to the edit event page
   */
  static readonly EditEvent = "/app/event/edit";

  /**
   * The route to the terms of use page
   */
  static readonly TermsOfUse = "/terms-of-use";

  /**
   * The route to the privacy policy page
   */
  static readonly PrivacyPolicy = "/privacy-policy";

  /**
   * The route to the check in page
   */
  static readonly CheckIn = (eventId: string, name: string) => `/app/event/check-in?id=${eventId}&name=${name}`;
}
