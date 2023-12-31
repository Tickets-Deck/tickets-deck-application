import axios from "axios";
import { ApiRoutes } from "./apiRoutes";
import { UserCredentialsRequest } from "../models/IUser";
import { EventRequest } from "../models/IEvents";

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

export function useFetchEventsByEventId() {
  async function fetchEventsByEventId(eventId: string) {
    return API.get(`${ApiRoutes.Events}?eventId=${eventId}`);
  }

  return fetchEventsByEventId;
}

// export function useFetchEventsByPublisherId() {}
