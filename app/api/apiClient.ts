import axios from "axios";
import { ApiRoutes } from "./apiRoutes";
import {
  CoverPhotoRequest,
  ProfilePhotoRequest,
  UserCredentialsRequest,
  UserCredentialsUpdateRequest,
  UsernameRequest,
} from "../models/IUser";
import { EventRequest } from "../models/IEvents";
import { TicketOrderRequest } from "../models/ITicketOrder";
import { InitializePayStack } from "../models/IInitializePayStack";
import { TicketCategory } from "../enums/ITicket";
import { TicketRequest, TicketResponse } from "../models/ITicket";
import { FollowsActionType } from "../models/IFollows";
import { CustomerEnquiry } from "../models/ICustomerEnquiries";
import {
  PasswordResetLinkRequest,
  PasswordResetRequest,
} from "../models/IPassword";
import { BankAccount, BankAccountDetailsRequest } from "../models/IBankAccount";

export const API = axios.create({
  baseURL: ApiRoutes.BASE_URL_DEV,
  timeout: 15000
});

export function useCreateNewsletterSubscriber() {
  async function createNewsletterSubscriber(email: string) {
    return API.post(ApiRoutes.CreateNewsletterSubscriber, { email });
  }

  return createNewsletterSubscriber;
}

//#region event

export function useCreateEvent() {
  async function createEvent(event: EventRequest) {
    return API.post(ApiRoutes.Events, event);
  }

  return createEvent;
}

export function useFetchEvents() {
  async function fetchEvents() {
    return API.get(ApiRoutes.Events);
  }

  return fetchEvents;
}

export function useFetchFeaturedEvents() {
  async function fetchFeaturedEvents() {
    return API.get(ApiRoutes.FeaturedEvents);
  }

  return fetchFeaturedEvents;
}

export function useFetchEventById() {
  async function fetchEvent(id: string) {
    return API.get(`${ApiRoutes.Events}?id=${id}`);
  }

  return fetchEvent;
}

export function useFetchUserEventsByUserId() {
  async function fetchUserEventsByUserId(userId: string) {
    return API.get(`${ApiRoutes.Events}?publisherId=${userId}`);
  }

  return fetchUserEventsByUserId;
}

export function useFetchEventByEventId() {
  async function fetchEventsByEventId(eventId: string) {
    return API.get(`${ApiRoutes.Events}?eventId=${eventId}`);
  }

  return fetchEventsByEventId;
}

export function useFetchEventsByPublisherId() {
  async function fetchEventsByPublisherId(publisherId: string) {
    return API.get(`${ApiRoutes.Events}?publisherId=${publisherId}`);
  }

  return fetchEventsByPublisherId;
}

export function useFetchEventsByTags() {
  async function fetchEventsByPublisherId(tags: string[], eventId: string) {
    return API.get(
      `${ApiRoutes.Events}?tags=${tags.join(",")}&eventId=${eventId}`
    );
  }

  return fetchEventsByPublisherId;
}

export function useCheckInTicketOrder() {
  async function checkInTicketOrder(ticketOrderId: string, eventId: string) {
    return API.post(
      `${ApiRoutes.CheckInTicketOrder}?ticketOrderId=${ticketOrderId}&eventId=${eventId}`
    );
  }

  return checkInTicketOrder;
}

export function useCheckInMultipleTicketOrders() {
  async function checkInMultipleTicketOrders(ticketOrderId: string, eventId: string, orderIds: string[]) {
    return API.post(
      `${ApiRoutes.CheckInMultipleTicketOrder}?ticketOrderId=${ticketOrderId}&eventId=${eventId}`, { orderIds }
    );
  }

  return checkInMultipleTicketOrders;
}

export function useUpdateEventById() {
  async function updateEventById(id: string, data: EventRequest) {
    return API.put(`${ApiRoutes.Events}?id=${id}`, data);
  }

  return updateEventById;
}

export function useDeleteEvent() {
  async function deleteEvent(id: string) {
    return API.delete(`${ApiRoutes.Events}?id=${id}`);
  }

  return deleteEvent;
}

//#endregion

//#region user

export function useCreateUser() {
  async function createUser(user: UserCredentialsRequest) {
    return API.post(ApiRoutes.Users, user);
  }

  return createUser;
}

export function useFetchUserInformation() {
  async function fetchUserInformation(userId: string) {
    return API.get(`${ApiRoutes.Users}?userId=${userId}`);
  }

  return fetchUserInformation;
}

export function useFetchUserInformationByUserName() {
  async function fetchUserInformationByUserName(data: {
    username?: string;
    userId?: string;
  }) {
    return API.get(
      `${ApiRoutes.Users}${data.username ? `?userName=${data.username}` : ""}${
        data.userId ? `?userId=${data.userId}` : ""
      }`
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
  async function updateUserName(userId: string, data: UsernameRequest) {
    return API.put(`${ApiRoutes.UpdateUserName}?userId=${userId}`, data);
  }

  return updateUserName;
}

export function useUpdateUserInformation() {
  async function updateUserInformation(
    userId: string,
    data: UserCredentialsUpdateRequest
  ) {
    return API.put(`${ApiRoutes.Users}?userId=${userId}`, data);
  }

  return updateUserInformation;
}

//#endregion

export function useVerifyUserEmail() {
  async function verifyUserEmail(token: string) {
    return API.get(`${ApiRoutes.VerifyUserEmail}?token=${token}`);
  }

  return verifyUserEmail;
}

export function useResendVerificationLink() {
  async function resendVerificationLink(email: string) {
    return API.post(`${ApiRoutes.VerifyUserEmail}?email=${email}`);
  }

  return resendVerificationLink;
}

export function useCreateTicketOrder() {
  async function createTicketOrder(data: TicketOrderRequest) {
    return API.post(ApiRoutes.TicketOrder, data);
  }

  return createTicketOrder;
}

export function useInitializePaystackPayment() {
  async function initializePaystackPayment(data: InitializePayStack) {
    return API.post(ApiRoutes.Payment, data);
  }

  return initializePaystackPayment;
}

export function useVerifyPaystackPayment() {
  async function verifyPaystackPayment(reference: string) {
    return API.get(`${ApiRoutes.Payment}?trxref=${reference}`);
  }

  return verifyPaystackPayment;
}

export function useFetchDashboardInfo() {
  async function fetchDashboardInfo(userId: string) {
    return API.get(`${ApiRoutes.Dashboard}?userId=${userId}`);
  }

  return fetchDashboardInfo;
}

export function useFetchUserTicketOrders() {
  async function fetchUserTicketOrders(
    userId: string,
    category?: TicketCategory
  ) {
    return API.get(
      `${ApiRoutes.UserTicketOrder}?userId=${userId}&category=${category}`
    );
  }

  return fetchUserTicketOrders;
}

export function useFetchOrderInformationById() {
  async function fetchOrderInformationById(id: string) {
    return API.get(`${ApiRoutes.Orders}?ticketOrderId=${id}`);
  }

  return fetchOrderInformationById;
}

export function useCreateTicketForSpecifiedEvent() {
  async function createTicketForSpecifiedEvent(
    id: string,
    data: TicketRequest
  ) {
    return API.post(`${ApiRoutes.Tickets}?id=${id}`, data);
  }

  return createTicketForSpecifiedEvent;
}

export function useUpdateTicketInformationById() {
  async function updateTicketInformationById(
    ticketId: string,
    data: TicketResponse
  ) {
    return API.put(`${ApiRoutes.Tickets}?ticketId=${ticketId}`, data);
  }

  return updateTicketInformationById;
}

export function useDeleteTicketById() {
  async function deleteTicketById(ticketId: string) {
    return API.delete(`${ApiRoutes.Tickets}?ticketId=${ticketId}`);
  }

  return deleteTicketById;
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

export function useCreateCustomerEnquiry() {
  async function createCustomerEnquiry(data: CustomerEnquiry) {
    return API.post(ApiRoutes.CustomerEnquiries, data);
  }

  return createCustomerEnquiry;
}

export function useFetchCustomerEnquiries() {
  async function fetchCustomerEnquiries() {
    return API.get(ApiRoutes.CustomerEnquiries);
  }

  return fetchCustomerEnquiries;
}

export function useUpdateCustomerEnquiriesStatus() {
  async function updateCustomerEnquiriesById(id: string) {
    return API.get(`${ApiRoutes.CustomerEnquiries}?id=${id}`);
  }

  return updateCustomerEnquiriesById;
}

export function useFetchUserRecentTransactions() {
  async function fetchUserRecentTransactions(
    userId: string,
    duration?: string
  ) {
    return API.get(
      `${ApiRoutes.UserRecentTransactions}?userId=${userId}${
        duration ? `&duration=${duration}` : undefined
      }`
    );
  }

  return fetchUserRecentTransactions;
}

export function useFetchEventLikeStatus() {
  async function fetchEventLikeStatus(userId: string, eventId: string) {
    return API.get(
      `${ApiRoutes.LikeEvent}?userId=${userId}&eventId=${eventId}`
    );
  }

  return fetchEventLikeStatus;
}

export function useFetchUserFavoriteEvents() {
  async function fetchUserFavoriteEvents(userId: string) {
    return API.get(`${ApiRoutes.UserFavoriteEvents}?userId=${userId}`);
  }

  return fetchUserFavoriteEvents;
}

export function useLikeEvent() {
  async function likeEvent(userId: string, eventId: string, action: string) {
    return API.post(
      `${ApiRoutes.LikeEvent}?userId=${userId}&eventId=${eventId}&action=${action}`
    );
  }

  return likeEvent;
}

export function useRequestPasswordResetLink() {
  async function requestPasswordResetLink(data: PasswordResetLinkRequest) {
    return API.post(ApiRoutes.UserPasswordResetLink, data);
  }

  return requestPasswordResetLink;
}

export function useResetPassword() {
  async function resetPassword(data: PasswordResetRequest) {
    return API.post(ApiRoutes.UserPasswordReset, data);
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
  async function fetchBankList() {
    return API.get(ApiRoutes.FetchAllBanks);
  }

  return fetchBankList;
}

export function useFetchBankDetails() {
  async function fetchBankDetails({
    accountNumber,
    bankCode,
  }: BankAccountDetailsRequest) {
    return API.get(
      `${ApiRoutes.FetchBankDetails}?accountNumber=${accountNumber}&bankCode=${bankCode}`
    );
  }

  return fetchBankDetails;
}

export function useCreateUserBankAccount() {
  async function createUserBankAccount(userId: string, data: BankAccount) {
    return API.post(`${ApiRoutes.UserBankAccount}?userId=${userId}`, data);
  }

  return createUserBankAccount;
}

export function useFetchUserBankAccount() {
  async function fetchUserBankAccount(userId: string) {
    return API.get(`${ApiRoutes.UserBankAccount}?userId=${userId}`);
  }

  return fetchUserBankAccount;
}

export function useFetchTransactionFee() {
  async function fetchTransactionFee() {
    return API.get(ApiRoutes.TransactionFee);
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

// export
