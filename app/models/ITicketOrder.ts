import { EventVisibility } from "../enums/IEventVisibility";
import { OrderStatus } from "../enums/IOrderStatus";

export interface SingleTicketOrderRequest {
  ticketId: string;
  price: number;
  associatedEmail: string;
  contactEmail: string;
}

export interface TicketOrderRequest {
  userId: string;
  eventId: string;
  tickets: SingleTicketOrderRequest[];
  contactEmail: string;
  contactPhone?: string;
  contactFirstName?: string;
  contactLastName?: string;
  couponCode?: string;
}

//#region Responses

export interface TicketEventOrderResponse {
    title: string;
    venue: string;
    date: string;
    time: string;
    mainImageUrl: string;
}

export interface TicketOrderResponse {
  id: string;
  eventId: string;
  name: string;
  price: string;
  quantity: number;
  remainingTickets: number;
  numberOfUsers: number;
  description: null;
  ticketOrdersCount: number;
  createdAt: string;
  updatedAt: string;
  event: TicketEventOrderResponse;
}

export interface UserTicketOrder {
  id: string;
  ticketId: string;
  orderId: string;
  associatedEmail: string;
  contactEmail: string;
  price: string;
  orderStatus: OrderStatus;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
  ticket: TicketOrderResponse;
}

//#endregion