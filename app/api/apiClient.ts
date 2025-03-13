import axios from "axios";
import { ApiRoutes } from "./apiRoutes";
import {
  CoverPhotoRequest,
  ProfilePhotoRequest,
  UserCredentialsRequest,
  UserCredentialsUpdateRequest,
  UsernameRequest,
} from "../models/IUser";
import { EventRequest, UpdateEventRequest } from "../models/IEvents";
import { TicketOrderRequest } from "../models/ITicketOrder";
import { InitializePayStack } from "../models/IInitializePayStack";
import { TicketRequest, TicketResponse } from "../models/ITicket";
import { FollowsActionType } from "../models/IFollows";
import { CustomerEnquiry } from "../models/ICustomerEnquiries";
import {
  PasswordResetLinkRequest,
  PasswordResetRequest,
} from "../models/IPassword";
import { BankAccount, BankAccountDetailsRequest } from "../models/IBankAccount";

export const API = axios.create({
  baseURL: ApiRoutes.BASE_URL,
});

export const getApiConfig = (token: string) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
    },
  };
};

export function useRequestCredentialToken() {
  async function requestToken() {
    return API.get(ApiRoutes.RequestCredentialToken, getApiConfig(""));
  }

  return requestToken;
}

export function useCreateNewsletterSubscriber() {
  async function createNewsletterSubscriber(email: string) {
    return API.post(
      ApiRoutes.CreateNewsletterSubscriber,
      { email },
      getApiConfig("")
    );
  }

  return createNewsletterSubscriber;
}

export function useCreateCustomerEnquiry() {
  async function createCustomerEnquiry(data: CustomerEnquiry) {
    return API.post(ApiRoutes.CustomerEnquiries, data, getApiConfig(""));
  }

  return createCustomerEnquiry;
}

//#region event

export function useCreateEvent() {
  async function createEvent(token: string, event: EventRequest) {
    return API.post(ApiRoutes.Events, event, getApiConfig(token));
  }

  return createEvent;
}

export function useFetchEvents() {
  // Request token
  const requestToken = useRequestCredentialToken();
  async function fetchEvents() {
    const token = await requestToken();
    return API.get(ApiRoutes.Events, getApiConfig(token.data.token));
  }

  return fetchEvents;
}

export function useFetchPastEvents() {
  // Request token
  const requestToken = useRequestCredentialToken();
  async function fetchPastEvents(page?: number, limit?: number) {
    const token = await requestToken();
    return API.get(
      `${ApiRoutes.FetchPastEvents}?page=${page}&limit=${limit}`,
      getApiConfig(token.data.token)
    );
  }

  return fetchPastEvents;
}

export function useFetchEventsByPublisherId() {
  const requestToken = useRequestCredentialToken();
  async function fetchEventsByPublisherId(publisherId: string) {
    const token = await requestToken();
    return API.get(
      ApiRoutes.FetchEventsByPublisherId(publisherId),
      getApiConfig(token.data.token)
    );
  }

  return fetchEventsByPublisherId;
}

export function useFetchOrganizerEvents() {
  async function fetchOrganizerEvents(token: string, publisherId: string) {
    return API.get(
      ApiRoutes.FetchOrganizerEvents(publisherId),
      getApiConfig(token)
    );
  }

  return fetchOrganizerEvents;
}

export function useFetchEventsByTags() {
  async function fetchEventsByPublisherId(tags: string[], eventId: string) {
    return API.get(
      `${ApiRoutes.Events}?tags=${tags.join(",")}&eventId=${eventId}`
    );
  }

  return fetchEventsByPublisherId;
}

export function useFetchFeaturedEvents() {
  // Request token
  const requestToken = useRequestCredentialToken();
  async function fetchFeaturedEvents() {
    const token = await requestToken();
    return API.get(ApiRoutes.FeaturedEvents, getApiConfig(token.data.token));
  }

  return fetchFeaturedEvents;
}

export function useFetchEventById() {
  // Request token
  const requestToken = useRequestCredentialToken();
  async function fetchEvent(id: string) {
    const token = await requestToken();
    return API.get(`${ApiRoutes.Events}/${id}`, getApiConfig(token.data.token));
  }

  return fetchEvent;
}

export function useFetchPublisherEventById() {
  async function fetchEvent(token: string, id: string) {
    return API.get(ApiRoutes.FetchOrganizerEvent(id), getApiConfig(token));
  }

  return fetchEvent;
}

export function useCheckInTicketOrder() {
  async function checkInTicketOrder(
    token: string,
    ticketOrderId: string,
    eventId: string
  ) {
    return API.post(
      ApiRoutes.CheckInTicketOrder(ticketOrderId, eventId),
      {},
      getApiConfig(token)
    );
  }

  return checkInTicketOrder;
}

export function useCheckInMultipleTicketOrders() {
  async function checkInMultipleTicketOrders(
    token: string,
    ticketOrderId: string,
    eventId: string,
    orderedTicketIds: string[]
  ) {
    return API.post(
      ApiRoutes.CheckInMultipleTicketOrder(ticketOrderId, eventId),
      { orderedTicketIds },
      getApiConfig(token)
    );
  }

  return checkInMultipleTicketOrders;
}

export function useUpdateEventById() {
  async function updateEventById(
    token: string,
    eventId: string,
    data: UpdateEventRequest
  ) {
    return API.put(`${ApiRoutes.Events}/${eventId}`, data, getApiConfig(token));
  }

  return updateEventById;
}

export function useDeleteEvent() {
  async function deleteEvent(token: string, id: string) {
    return API.delete(`${ApiRoutes.Events}/${id}`, getApiConfig(token));
  }

  return deleteEvent;
}

export function useRecordEventView() {
  const requestToken = useRequestCredentialToken();
  async function recordEventView(eventId: string, userId?: string) {
    const token = await requestToken();
    return API.post(
      ApiRoutes.RecordEventView(eventId, userId),
      {},
      getApiConfig(token.data.token)
    );
  }

  return recordEventView;
}

export function useFetchEventViewsCount() {
  const requestToken = useRequestCredentialToken();
  async function fetchEventViewsCount(eventId: string) {
    const token = await requestToken();
    return API.get<{ viewsCount: number }>(
      ApiRoutes.FetchEventViewsCount(eventId),
      getApiConfig(token.data.token)
    );
  }

  return fetchEventViewsCount;
}

export function useFetchEventViewsAnalytics() {
  const requestToken = useRequestCredentialToken();
  async function fetchEventViewsAnalytics(eventId: string) {
    const token = await requestToken();
    return API.get(
      ApiRoutes.FetchEventViewsAnalytics(eventId),
      getApiConfig(token.data.token)
    );
  }

  return fetchEventViewsAnalytics;
}

export function useFetchEventCategories() {
  // Request token
  const requestToken = useRequestCredentialToken();

  async function fetchEventCategories() {
    const token = await requestToken();
    return API.get(ApiRoutes.EventCategory, getApiConfig(token.data.token));
  }

  return fetchEventCategories;
}

export function useFetchTrendingEventCategories() {
  async function fetchTrendingEventCategories() {
    return API.get(ApiRoutes.TrendingEventCategories, getApiConfig(""));
  }

  return fetchTrendingEventCategories;
}

export function useFetchEventLikeStatus() {
  async function fetchEventLikeStatus(token: string, eventId: string) {
    return API.get(ApiRoutes.EventLikeStatus(eventId), getApiConfig(token));
  }

  return fetchEventLikeStatus;
}

export function useLikeEvent() {
  async function likeEvent(token: string, userId: string, eventId: string) {
    return API.post(
      ApiRoutes.LikeEvent(eventId, userId),
      {},
      getApiConfig(token)
    );
  }

  return likeEvent;
}

export function useUnlikeEvent() {
  async function unlikeEvent(token: string, userId: string, eventId: string) {
    return API.delete(
      ApiRoutes.UnlikeEvent(eventId, userId),
      getApiConfig(token)
    );
  }

  return unlikeEvent;
}

//#endregion

//#region user

export function useCreateUser() {
  const requestToken = useRequestCredentialToken();
  async function createUser(user: UserCredentialsRequest) {
    const token = await requestToken();

    return API.post(ApiRoutes.UserSignup, user, getApiConfig(token.data.token));
  }

  return createUser;
}

export function useFetchUserInformation() {
  const requestToken = useRequestCredentialToken();
  async function fetchUserInformation(userId: string) {
    const token = await requestToken();
    return API.get(
      ApiRoutes.FetchUserInformation(userId),
      getApiConfig(token.data.token)
    );
  }

  return fetchUserInformation;
}

export function useFetchUserInformationByUserName() {
  const requestToken = useRequestCredentialToken();
  async function fetchUserInformationByUserName(username: string) {
    const token = await requestToken();
    return API.get(
      ApiRoutes.FetchUserByUsername(username),
      getApiConfig(token.data.token)
    );
  }

  return fetchUserInformationByUserName;
}

export function useUploadUserProfilePhoto() {
  async function uploadUserProfilePhoto(
    userId: string,
    data: ProfilePhotoRequest
  ) {
    return API.post(
      `${ApiRoutes.UploadUserProfilePhoto}?userId=${userId}`,
      data
    );
  }

  return uploadUserProfilePhoto;
}

export const useUpdateUserCoverPhoto = () => {
  async function updateUserCoverPhoto(userId: string, data: CoverPhotoRequest) {
    return API.post(`${ApiRoutes.UpdateUserCoverPhoto}?userId=${userId}`, data);
  }

  return updateUserCoverPhoto;
};

export function useUpdateUserName() {
  async function updateUserName(
    token: string,
    userId: string,
    data: UsernameRequest
  ) {
    return API.put(ApiRoutes.UpdateUserName(userId), data, getApiConfig(token));
  }

  return updateUserName;
}

export function useUpdateUserProfileInformation() {
  async function updateUserProfileInformation(
    token: string,
    userId: string,
    data: UserCredentialsUpdateRequest
  ) {
    return API.put(
      ApiRoutes.UpdateUserProfileInformation(userId),
      data,
      getApiConfig(token)
    );
  }

  return updateUserProfileInformation;
}

//#endregion

export function useVerifyUserEmail() {
  const requestToken = useRequestCredentialToken();
  async function verifyUserEmail(token: string, userId: string) {
    const credentialToken = await requestToken();
    return API.post(
      ApiRoutes.VerifyUserEmail(userId),
      { token },
      getApiConfig(credentialToken.data.token)
    );
  }

  return verifyUserEmail;
}

export function useResendVerificationLink() {
  const requestToken = useRequestCredentialToken();
  async function resendVerificationLink(userId: string) {
    const token = await requestToken();
    return API.get(
      ApiRoutes.ResendVerificationEmail(userId),
      getApiConfig(token.data.token)
    );
  }

  return resendVerificationLink;
}

export function useInitializeTicketOrder() {
  const requestToken = useRequestCredentialToken();
  async function initializeTicketOrder(data: TicketOrderRequest) {
    const token = await requestToken();
    return API.post(
      ApiRoutes.InitializeTicketOrder,
      data,
      getApiConfig(token.data.token)
    );
  }

  return initializeTicketOrder;
}

export function useInitializePaystackPayment() {
  const requestToken = useRequestCredentialToken();
  async function initializePaystackPayment(data: InitializePayStack) {
    const token = await requestToken();
    return API.post(
      ApiRoutes.InitializePayment,
      data,
      getApiConfig(token.data.token)
    );
  }

  return initializePaystackPayment;
}

export function useVerifyPaystackPayment() {
  const requestToken = useRequestCredentialToken();
  async function verifyPaystackPayment(reference: string) {
    const token = await requestToken();
    return API.get(
      ApiRoutes.VerifyPayment(reference),
      getApiConfig(token.data.token)
    );
  }

  return verifyPaystackPayment;
}

export function useFetchDashboardInfo() {
  async function fetchDashboardInfo(token: string, userId: string) {
    return API.get(
      ApiRoutes.FetchDashboardInformation(userId),
      getApiConfig(token)
    );
  }

  return fetchDashboardInfo;
}

export function useFetchUserBoughtTickets() {
  async function fetchUserBoughtTickets(token: string, userId: string) {
    return API.get(ApiRoutes.FetchTicketsBought(userId), getApiConfig(token));
  }

  return fetchUserBoughtTickets;
}

export function useFetchUserSoldTickets() {
  async function fetchUserSoldTickets(token: string, publisherId: string) {
    return API.get(
      ApiRoutes.FetchTicketsSold(publisherId),
      getApiConfig(token)
    );
  }

  return fetchUserSoldTickets;
}

export function useFetchOrderInformationById() {
  const requestToken = useRequestCredentialToken();
  async function fetchOrderInformationById(id: string) {
    const token = await requestToken();
    return API.get(
      ApiRoutes.FetchOrderInformation(id),
      getApiConfig(token.data.token)
    );
  }

  return fetchOrderInformationById;
}

export function useCreateTicketForSpecifiedEvent() {
  async function createTicketForSpecifiedEvent(
    token: string,
    eventId: string,
    data: TicketRequest
  ) {
    return API.post(
      `${ApiRoutes.Tickets}/${eventId}`,
      data,
      getApiConfig(token)
    );
  }

  return createTicketForSpecifiedEvent;
}

export function useFetchEventTickets() {
  async function fetchEventTickets(token: string, eventId: string) {
    return API.get(ApiRoutes.FetchEventTickets(eventId), getApiConfig(token));
  }

  return fetchEventTickets;
}

export function useUpdateTicketInformation() {
  async function updateTicketInformation(
    token: string,
    ticketId: string,
    data: TicketResponse
  ) {
    return API.put(ApiRoutes.UpdateTicket(ticketId), data, getApiConfig(token));
  }

  return updateTicketInformation;
}

export function useDeleteTicket() {
  async function deleteTicket(token: string, ticketId: string) {
    return API.delete(ApiRoutes.DeleteTicket(ticketId), getApiConfig(token));
  }

  return deleteTicket;
}

export function useFollowUser() {
  async function followUser(
    subjectUserId: string,
    objectUserId: string,
    actionType: FollowsActionType
  ) {
    return API.post(
      `${ApiRoutes.Follows}?subjectiveUserId=${subjectUserId}&objectiveUserId=${objectUserId}&actionType=${actionType}`
    );
  }

  return followUser;
}

export function useFetchUserFollowMetrics() {
  /**
   * Fetches the number of followers and following of a user, and whether the logged in user is following the user
   * @param objectiveUserId is the user whose followers and following you want to fetch
   * @param subjectUserId is the logged in user who is the subject of the follow action
   * @returns the API response
   */
  async function fetchUserFollowMetrics(
    objectiveUserId: string,
    subjectUserId?: string
  ) {
    return API.get(
      `${ApiRoutes.Follows}?objectiveUserId=${objectiveUserId}&subjectUserId=${subjectUserId}`
    );
  }

  return fetchUserFollowMetrics;
}

export function useFetchUserRecentTransactions() {
  async function fetchUserRecentTransactions(
    token: string,
    userId: string,
    duration?: number
  ) {
    return API.get(
      ApiRoutes.UserRecentTransactions(userId, duration),
      getApiConfig(token)
    );
  }

  return fetchUserRecentTransactions;
}

export function useFetchUserFavoriteEvents() {
  async function fetchUserFavoriteEvents(token: string, userId: string) {
    return API.get(ApiRoutes.UserFavoriteEvents(userId), getApiConfig(token));
  }

  return fetchUserFavoriteEvents;
}

export function useRequestPasswordResetLink() {
  const requestToken = useRequestCredentialToken();
  async function requestPasswordResetLink(data: PasswordResetLinkRequest) {
    const token = await requestToken();
    return API.post(
      ApiRoutes.UserPasswordResetLink,
      data,
      getApiConfig(token.data.token)
    );
  }

  return requestPasswordResetLink;
}

export function useResetPassword() {
  const requestToken = useRequestCredentialToken();
  async function resetPassword(data: PasswordResetRequest) {
    const token = await requestToken();
    return API.post(
      ApiRoutes.UserPasswordReset,
      data,
      getApiConfig(token.data.token)
    );
  }

  return resetPassword;
}

export function useFetchUserWalletBalance() {
  async function fetchUserWalletBalance(userId: string) {
    return API.get(`${ApiRoutes.UserWalletBalance}?userId=${userId}`);
  }

  return fetchUserWalletBalance;
}

export function useFetchBankList() {
  const requestToken = useRequestCredentialToken();
  async function fetchBankList() {
    const token = await requestToken();
    return API.get(ApiRoutes.FetchAllBanks, getApiConfig(token.data.token));
  }

  return fetchBankList;
}

export function useFetchBankDetails() {
  async function fetchBankDetails(
    token: string,
    { accountNumber, bankCode }: BankAccountDetailsRequest
  ) {
    return API.get(
      ApiRoutes.FetchBankDetails(bankCode, accountNumber),
      getApiConfig(token)
    );
  }

  return fetchBankDetails;
}

export function useCreateUserBankAccount() {
  async function createUserBankAccount(
    token: string,
    userId: string,
    data: BankAccount
  ) {
    return API.post(
      ApiRoutes.UserBankAccount(userId),
      data,
      getApiConfig(token)
    );
  }

  return createUserBankAccount;
}

export function useFetchUserBankAccount() {
  async function fetchUserBankAccount(token: string, userId: string) {
    return API.get(ApiRoutes.UserBankAccount(userId), getApiConfig(token));
  }

  return fetchUserBankAccount;
}

///todo: Remove this endpoint, so we move the functionality to the backend ~ add transaction fee to the event info response
export function useFetchTransactionFee() {
  // Request token
  const requestToken = useRequestCredentialToken();

  async function fetchTransactionFee(eventId: string) {
    const token = await requestToken();
    return API.get(
      ApiRoutes.TransactionFee(eventId),
      getApiConfig(token.data.token)
    );
  }

  return fetchTransactionFee;
}

export function useVerifyCouponCode() {
  async function verifyCouponCode(eventId: string, couponCode: string) {
    return API.get(
      `${ApiRoutes.VerifyCouponCode}?eventId=${eventId}&couponCode=${couponCode}`
    );
  }

  return verifyCouponCode;
}
