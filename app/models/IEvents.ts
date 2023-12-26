import { EventVisibility } from "../enums/IEventVisibility";
import { Tickets } from "./ITicket";

export type EventImages = {
  id: string;
  imageUrl: string;
};

export type EventRequest = {
  publisherId: string;

  title: string;
  description: string;
  location: Location;
  locationId: string;
  date: Date;
  time: Date;
  category: string;
  tag: string;
  visibility: EventVisibility;

  mainImageUrl: string;
  images: EventImages[];

  currency: string;
  tickets: Tickets[];
  purchaseStartDate: Date;
  purchaseEndDate: Date;
  allowedGuestType: string;
};
