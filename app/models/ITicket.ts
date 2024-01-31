export type TicketRequest = {
  role: string;
  price: number;
  quantity: number;
  remainingTickets: number;
};

export type TicketResponse = TicketRequest & {
  id: string;
  eventId: string;
  ticketsPurchasedCount: number;
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