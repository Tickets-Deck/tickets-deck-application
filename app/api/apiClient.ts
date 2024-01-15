import axios from "axios";
import { ApiRoutes } from "./apiRoutes";
import { UserCredentialsRequest } from "../models/IUser";
import { EventRequest } from "../models/IEvents";

export const API = axios.create({
  baseURL: ApiRoutes.BASE_URL_TEST,
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

export function useDeleteEvent() {
    async function deleteEvent(id: string) {
        return API.delete(`${ApiRoutes.Events}?id=${id}`);
    }
    
    return deleteEvent;
}

export function useFetchEventsByEventId() {
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