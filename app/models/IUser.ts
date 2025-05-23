import { FlagOptions } from "../enums/UserFlag";
import { Bookmarks } from "./IBookmark";
import { Favourites } from "./IFavourites";
import { TicketPurchased } from "./ITicket";

export type CustomerContactDetails = {
  firstName: string;
  lastName: string;
  phone: string;
};

export type UserCredentialsRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string | undefined;
  profilePhoto: string | undefined;
  coverPhoto: string | undefined;
};

type Flag = {
  flagName: FlagOptions;
  flagValue: boolean;
};

export type UserCredentialsResponse = UserCredentialsRequest & {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  profilePhotoId: string | undefined;
  coverPhotoId: string | undefined;
  events: Event[] | undefined;

  occupation: string | undefined;
  bio: string | undefined;

  socialLinks: SocialLinks | null;
  stats: UserStats | null;

  bookmarks: Bookmarks[];
  favorites: Favourites[];

  flags: Flag[];

  ticketsPurchased: TicketPurchased[];
};

export type ProfilePhotoRequest = {
  profilePhoto: string;
};

export type CoverPhotoRequest = {
  coverPhoto: string;
};

export type UsernameRequest = {
  username: string;
};

export type SocialLinks = {
  facebookUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
};

export type UserStats = {
  followersCount: number;
  followingCount: number;
  eventsCount: number;
  bookmarksCount: number;
  favoritesCount: number;
  ticketsBought: number;
  ticketsSold: number;
  totalRevenue: number;
};

export type UserCredentialsUpdateRequest = {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  socialLinks: SocialLinks | null;
};
