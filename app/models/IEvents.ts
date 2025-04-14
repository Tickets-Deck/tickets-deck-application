import { EventVisibility } from "../enums/IEventVisibility";
import { Location } from "./ILocation";
import { TicketRequest, TicketResponse, TicketPurchased } from "./ITicket";

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
  mainImageId: string;
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
  ticketOrdersCount: number;
  ticketsPurchased: TicketPurchased[];
  organizerPaysFee: boolean;

  netEarnings?: number;
};

export type FeaturedEvent = EventResponse & {
    isTrending: boolean;
    startingPrice: string;
    remainingTickets: number;
};

export enum EventFavoriteAction {
  Like = "like",
  Unlike = "unlike",
}

export type UpdateEventRequest = {
  eventId: string;
  publisherId: string;

  title: string | null;
  description: string | null;
  location: Location | null;
  venue: string | null;
  startDate: Date | string | null;
  endDate: Date | string | null;
  categoryId: string | null;
  tags: string[] | null;
  visibility: EventVisibility | null;

  // mainImageBase64Url: string | null;
  // images: EventImages[] | null;

  currency: string | null;
  tickets: TicketRequest[] | null;
  organizerPaysFee: boolean | null;
  isArchived: boolean | null;
  purchaseStartDate: Date | string | null;
  purchaseEndDate: Date | string | null;
  allowedGuestType: string | null;
};
