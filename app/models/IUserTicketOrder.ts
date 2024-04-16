import { OrderStatus } from "../enums/IOrderStatus";
import { PaymentStatus } from "../enums/IPaymentStatus";
import { EventResponse } from "./IEvents";

interface UserTicketResponse {
  id: string;
  eventId: string;
  name: string;
  price: string;
  quantity: number;
  remainingTickets: number;
  numberOfUsers: number;
  description: string;
  ticketOrdersCount: number;
  createdAt: string;
  updatedAt: string;
}

interface UserOrderedTicket {
  id: string;
  ticketId: string;
  orderId: string;
  associatedEmail: string;
  contactEmail: string;
  price: string;
  orderStatus: string;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
  ticket: UserTicketResponse;
}

export interface UserTicketOrder {
  id: string;
  userId: string | null;
  eventId: string;
  quantity: number;
  totalPrice: string;
  contactEmail: string;
  orderId: string;
  orderStatus: string;
  paymentStatus: PaymentStatus;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
  event: EventResponse;
  orderedTickets: UserOrderedTicket[];
}
