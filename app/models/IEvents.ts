import { EventVisibility } from "../enums/IEventVisibility";
import { Bookmarks } from "./IBookmark";
import { Favourites } from "./IFavourites";
import { Location } from "./ILocation";
import { TicketRequest, TicketResponse, TicketPurchased } from "./ITicket";
import { UserCredentialsResponse } from "./IUser";

export type EventImages = {
  id: string;
  imageUrl: string;
};

export type EventPublisher = {
  username: string;
  id: string;
  profilePhoto: string;
  firstName: string;
  lastName: string;
};

export type EventRequest = {
  eventId: string;
  publisherId: string;

  title: string;
  description: string;
  location: Location;
  venue: string;
  startDate: Date;
  endDate: Date;
  categoryId: string;
  tags: string[];
  visibility: EventVisibility;

  mainImageBase64Url: string;
  images: EventImages[];

  currency: string;
  tickets: TicketRequest[];
  organizerPaysFee: boolean;
  purchaseStartDate: Date;
  purchaseEndDate: Date;
  allowedGuestType: string;
};

export type EventResponse = {
  id: string;
  eventId: string;
  publisherId: string;
  title: string;
  description: string;
  onlineLink: string | null;
  locationId: string | null;
  venue: string;
  startDate: string;
  endDate: string;
  category: string;
  categoryId: string;
  visibility: string;
  mainImageUrl: string;
  currency: string;
  purchaseStartDate: string;
  purchaseEndDate: string;
  allowedGuestType: string;
  createdAt: string;
  updatedAt: string;
//   publisher: UserCredentialsResponse;
  publisher: EventPublisher;
  tickets: TicketResponse[];
  subImages: [];
  tags: string[];
  location: Location | null;
  isArchived: boolean;
  isFeatured: boolean;

  bookmarksCount: number;
  favoritesCount: number;
//   bookmarks: Bookmarks[];
//   favorites: Favourites[];
  ticketsPurchasedCount: number;
  ticketsPurchased: TicketPurchased[];
  organizerPaysFee: boolean;
};

export enum EventFavoriteAction {
  Like = "like",
  Unlike = "unlike",
}
