import { EventVisibility } from "../enums/IEventVisibility";
import { Tickets } from "./ITicket";

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
  tickets: Tickets[];
  purchaseStartDate: Date;
  purchaseEndDate: Date;
  allowedGuestType: string;
};
