import { EventVisibility } from "../enums/IEventVisibility";
import { Location } from "./ILocation";
import { TicketRequest, TicketResponse } from "./ITicket";
import { UserCredentialsResponse } from "./IUser";

export type EventImages = {
  id: string;
  imageUrl: string;
};

export type EventRequest = {
  eventId: string;
  publisherId: string;

  title: string;
  description: string;
  location: Location;
  venue: string;
  date: Date;
  time: string;
  category: string;
  tags: string[];
  visibility: EventVisibility;

  mainImageUrl: string;
  images: EventImages[];

  currency: string;
  tickets: TicketRequest[];
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
  locationId: string | null;
  venue: string;
  date: string;
  time: string;
  category: string;
  visibility: string;
  mainImageUrl: string;
  currency: string;
  purchaseStartDate: string;
  purchaseEndDate: string;
  allowedGuestType: string;
  createdAt: string;
  updatedAt: string;
  user: UserCredentialsResponse;
  tickets: TicketResponse[];
  images: [];
  tags: string[];
  location: Location | null;
};
