import { OrderStatus } from "../enums/IOrderStatus";
import { PaymentStatus } from "../enums/IPaymentStatus";
import { EventResponse } from "./IEvents";
import { UserTicketOrder } from "./ITicketOrder";

export interface UserTicketOrderInfo {
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
  orderedTickets: UserTicketOrder[];
}
