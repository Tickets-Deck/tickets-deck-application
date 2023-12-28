import axios from "axios";
import { ApiRoutes } from "./apiRoutes";
import { UserCredentialsRequest } from "../models/IUser";

export const API = axios.create({
  baseURL: ApiRoutes.BASE_URL_DEV,
});

export function useCreateNewsletterSubscriber() {
  async function createNewsletterSubscriber(email: string) {
    return API.post(ApiRoutes.CreateNewsletterSubscriber, { email });
  }

  return createNewsletterSubscriber;
}