export type TicketRequest = {
  name: string;
  price: number;
  numberOfUsers: number;
  quantity: number;
  remainingTickets: number;
  description: string;
  visibility: boolean;
};

export type TicketResponse = TicketRequest & {
  id: string;
  eventId: string;
  ticketOrdersCount: number;
  ticketsPurchased: TicketPurchased[];
  createdAt: string;
  updatedAt: string;
};

export type RetrievedTicketResponse = TicketResponse & {
    selectedTickets: number
    isSelected: boolean
}

export type TicketPurchased = {
    id: string;
    userId: string;
    eventId: string;
    ticketId: string;
    quantity: number;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
}