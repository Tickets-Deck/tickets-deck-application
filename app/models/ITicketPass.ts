import { EventResponse } from "./IEvents";

export interface TicketPass {
    eventInfo: EventResponse;
    ticketType: string;
    qr: string;
    orderId: string;
}