import axios from "axios";
import { ApiRoutes } from "./apiRoutes";
import { CoverPhotoRequest, ProfilePhotoRequest, UserCredentialsRequest, UserCredentialsUpdateRequest, UsernameRequest } from "../models/IUser";
import { EventRequest } from "../models/IEvents";
import { TicketOrderRequest } from "../models/ITicketOrder";
import { InitializePayStack } from "../models/IInitializePayStack";
import { TicketCategory } from "../enums/ITicket";
import { TicketRequest, TicketResponse } from "../models/ITicket";

export const API = axios.create({
  baseURL: ApiRoutes.BASE_URL_DEV,
});

export function useCreateNewsletterSubscriber() {
  async function createNewsletterSubscriber(email: string) {
    return API.post(ApiRoutes.CreateNewsletterSubscriber, { email });
  }

  return createNewsletterSubscriber;
}

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

export function useDeleteEvent() {
  async function deleteEvent(id: string) {
    return API.delete(`${ApiRoutes.Events}?id=${id}`);
  }

  return deleteEvent;
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
    return API.get(`${ApiRoutes.Events}?tags=${tags.join(',')}&eventId=${eventId}`);
  }

  return fetchEventsByPublisherId;
}

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
  async function fetchUserInformationByUserName(data: { username?: string, userId?: string}) {
    return API.get(`${ApiRoutes.Users}${data.username ? `?userName=${data.username}` : ''}${data.userId ? `?userId=${data.userId}` : ''}`);
  }

  return fetchUserInformationByUserName;
}

export function useUploadUserProfilePhoto() {
  async function uploadUserProfilePhoto(
    userId: string,
    data: ProfilePhotoRequest
  ) {
    return API.post(`${ApiRoutes.UploadUserProfilePhoto}?userId=${userId}`, data);
  }

  return uploadUserProfilePhoto;
}

export const useUpdateUserCoverPhoto = () => {
    async function updateUserCoverPhoto(userId: string, data: CoverPhotoRequest) {
        return API.post(`${ApiRoutes.UpdateUserCoverPhoto}?userId=${userId}`, data);
    }
    
    return updateUserCoverPhoto;
}

export function useUpdateUserName() {
    async function updateUserName(userId: string, data: UsernameRequest) {
        return API.put(`${ApiRoutes.UpdateUserName}?userId=${userId}`, data);
    }
    
    return updateUserName;
}

export function useUpdateUserInformation() {
    async function updateUserInformation(userId: string, data: UserCredentialsUpdateRequest) {
        return API.put(`${ApiRoutes.Users}?userId=${userId}`, data);
    }
    
    return updateUserInformation;
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
    async function fetchUserTicketOrders(userId: string, category?: TicketCategory) {
        return API.get(`${ApiRoutes.UserTicketOrder}?userId=${userId}&category=${category}`);
    }

    return fetchUserTicketOrders;
}

export function useFetchOrderInformationById() {
  async function fetchOrderInformationById(id: string) {
    return API.get(`${ApiRoutes.Orders}?ticketOrderId=${id}`);
  }

  return fetchOrderInformationById;
}

export function useUpdateTicketInformationById() {
  async function updateTicketInformationById(ticketId: string, data: TicketResponse) {
    return API.put(`${ApiRoutes.Tickets}?ticketId=${ticketId}`, data);
  }

  return updateTicketInformationById;
}