import { Bookmarks } from "./IBookmark";
import { Favourites } from "./IFavourites";
import { TicketPurchased } from "./ITicket";

export type UserCredentialsRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string | undefined;
  profilePhoto: string | undefined;
  coverPhoto: string | undefined;
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

  facebookUrl: string | undefined;
  twitterUrl: string | undefined;
  instagramUrl: string | undefined;
  linkedinUrl: string | undefined;

  followersCount: number;
  followingCount: number;
  eventsCount: number;
  bookmarksCount: number;
  favoritesCount: number;
  ticketsBought: number;
  ticketsSold: number;
  totalRevenue: number;

  bookmarks: Bookmarks[];
  favorites: Favourites[];

  emailVerified: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  isSuspended: boolean;
  isDeleted: boolean;
  isSuperAdmin: boolean;
  isSubscribed: boolean;
  isNewsletterSubscribed: boolean;

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

export type UserCredentialsUpdateRequest = {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
};
