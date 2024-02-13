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
}
