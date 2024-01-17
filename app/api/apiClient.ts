import axios from "axios";
import { ApiRoutes } from "./apiRoutes";
import { CoverPhotoRequest, ProfilePhotoRequest, UserCredentialsRequest, UserCredentialsUpdateRequest, UsernameRequest } from "../models/IUser";
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